import { prisma } from '../../config/database.js';
import { uploadToIPFS, uploadMetadata } from '../../utils/ipfs.js';
import { registerIPAsset } from '../../utils/story.js';
import type { Address } from 'viem';

export interface CreateIPAssetInput {
  title: string;
  description?: string;
  creatorWallet: string;
  content: Buffer | string;
  contentType: 'text' | 'image' | 'audio' | 'file';
  category?: string;
  tags?: string[];
}

/**
 * Register a new IP Asset
 */
export async function createIPAsset(input: CreateIPAssetInput) {
  const { title, description, creatorWallet, content, contentType, category, tags } = input;

  // Upload content to IPFS
  const fileName = `sentrix-${Date.now()}.${contentType === 'text' ? 'txt' : contentType}`;
  const { ipfsHash } = await uploadToIPFS(content, fileName);

  // Create metadata
  const metadata = {
    title,
    description,
    creatorWallet: creatorWallet.toLowerCase(),
    ipfsHash,
    category,
    tags: tags || [],
    contentType,
    createdAt: new Date().toISOString(),
  };

  // Upload metadata to IPFS
  const metadataHash = await uploadMetadata(metadata);

  // Register on Story Protocol
  const { ipId, txHash } = await registerIPAsset(
    ipfsHash,
    metadataHash,
    creatorWallet.toLowerCase() as Address
  );

  // Save to database
  const ipAsset = await prisma.iPAsset.create({
    data: {
      title,
      description,
      creatorWallet: creatorWallet.toLowerCase(),
      ipfsHash,
      metadataHash,
      storyIpId: ipId,
      storyTxHash: txHash,
      category,
      tags: tags || [],
    },
    include: {
      creator: true,
    },
  });

  return ipAsset;
}

/**
 * Get IP Asset by ID
 */
export async function getIPAssetById(id: string) {
  return prisma.iPAsset.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          walletAddress: true,
        },
      },
      licenses: {
        where: {
          status: 'active',
        },
      },
    },
  });
}

/**
 * Get IP Assets by creator wallet
 */
export async function getIPAssetsByCreator(walletAddress: string) {
  return prisma.iPAsset.findMany({
    where: {
      creatorWallet: walletAddress.toLowerCase(),
    },
    include: {
      creator: {
        select: {
          id: true,
          walletAddress: true,
        },
      },
      licenses: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get all IP Assets (with pagination)
 */
export async function getAllIPAssets(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [assets, total] = await Promise.all([
    prisma.iPAsset.findMany({
      skip,
      take: limit,
      include: {
        creator: {
          select: {
            id: true,
            walletAddress: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.iPAsset.count(),
  ]);

  return {
    assets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

