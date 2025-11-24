import { prisma } from '../../config/database.js';
import { createLicense, purchaseLicense } from '../../utils/story.js';
import { uploadMetadata } from '../../utils/ipfs.js';
import { createHash } from 'crypto';
import type { Address } from 'viem';

export interface CreateLicenseInput {
  ipId: string;
  creatorWallet: string;
  terms: {
    commercialRights: boolean;
    distributionRights: boolean;
    duration?: number; // in days
    exclusivity: boolean;
    price?: string; // in wei or token amount
    [key: string]: any;
  };
}

export interface PurchaseLicenseInput {
  licenseId: string;
  buyerWallet: string;
}

/**
 * Create a new license
 */
export async function createLicenseForIP(input: CreateLicenseInput) {
  const { ipId, creatorWallet, terms } = input;

  // Verify IP asset exists and belongs to creator
  const ipAsset = await prisma.iPAsset.findUnique({
    where: { id: ipId },
  });

  if (!ipAsset) {
    throw new Error('IP Asset not found');
  }

  if (ipAsset.creatorWallet.toLowerCase() !== creatorWallet.toLowerCase()) {
    throw new Error('Only the IP creator can create licenses');
  }

  // Create license on Story Protocol
  const { licenseId, txHash } = await createLicense(
    ipAsset.storyIpId || ipId,
    terms,
    creatorWallet.toLowerCase() as Address
  );

  // Save to database
  const license = await prisma.license.create({
    data: {
      ipId,
      creatorWallet: creatorWallet.toLowerCase(),
      termsJson: terms as any,
      storyLicenseId: licenseId,
      storyTxHash: txHash,
      status: 'pending',
      expiresAt: terms.duration
        ? new Date(Date.now() + terms.duration * 24 * 60 * 60 * 1000)
        : null,
    },
    include: {
      ipAsset: true,
    },
  });

  return license;
}

/**
 * Purchase a license
 */
export async function purchaseLicenseForUser(input: PurchaseLicenseInput) {
  const { licenseId, buyerWallet } = input;

  // Get license
  const license = await prisma.license.findUnique({
    where: { id: licenseId },
    include: {
      ipAsset: true,
    },
  });

  if (!license) {
    throw new Error('License not found');
  }

  if (license.status !== 'pending') {
    throw new Error('License is not available for purchase');
  }

  // Create license certificate
  const certificate = {
    licenseId: license.id,
    ipId: license.ipId,
    ipTitle: license.ipAsset.title,
    creatorWallet: license.creatorWallet,
    buyerWallet: buyerWallet.toLowerCase(),
    terms: license.termsJson,
    purchasedAt: new Date().toISOString(),
    expiresAt: license.expiresAt?.toISOString() || null,
  };

  // Upload certificate to IPFS
  const certificateHash = await uploadMetadata(certificate);

  // Create hash of certificate for on-chain storage
  const certificateOnChainHash = createHash('sha256')
    .update(JSON.stringify(certificate))
    .digest('hex');

  // Purchase on Story Protocol
  const { txHash } = await purchaseLicense(
    license.storyLicenseId || licenseId,
    buyerWallet.toLowerCase() as Address,
    `0x${certificateOnChainHash}`
  );

  // Update license in database
  const updatedLicense = await prisma.license.update({
    where: { id: licenseId },
    data: {
      buyerWallet: buyerWallet.toLowerCase(),
      certificateHash: `0x${certificateOnChainHash}`,
      storyTxHash: txHash,
      status: 'active',
    },
    include: {
      ipAsset: true,
      buyer: true,
    },
  });

  return {
    license: updatedLicense,
    certificate,
    certificateHash: `0x${certificateOnChainHash}`,
  };
}

/**
 * Get licenses by user wallet
 */
export async function getLicensesByUser(walletAddress: string, type: 'created' | 'purchased' = 'created') {
  const where = type === 'created'
    ? { creatorWallet: walletAddress.toLowerCase() }
    : { buyerWallet: walletAddress.toLowerCase() };

  return prisma.license.findMany({
    where,
    include: {
      ipAsset: {
        select: {
          id: true,
          title: true,
          ipfsHash: true,
        },
      },
      creator: {
        select: {
          id: true,
          walletAddress: true,
        },
      },
      buyer: {
        select: {
          id: true,
          walletAddress: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get license by ID
 */
export async function getLicenseById(licenseId: string) {
  return prisma.license.findUnique({
    where: { id: licenseId },
    include: {
      ipAsset: true,
      creator: true,
      buyer: true,
    },
  });
}

