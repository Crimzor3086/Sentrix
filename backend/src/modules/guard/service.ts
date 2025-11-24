import { prisma } from '../../config/database.js';
import { uploadToIPFS } from '../../utils/ipfs.js';
import { createHash } from 'crypto';

export interface SubmitReportInput {
  ipId: string;
  reporterWallet: string;
  url?: string;
  screenshotUrl?: string;
  fileUrl?: string;
  fileContent?: Buffer;
}

/**
 * Generate authenticity report by comparing hashes and metadata
 */
async function generateAuthenticityReport(
  ipAsset: any,
  reportedContent: { hash?: string; url?: string; metadata?: any }
): Promise<{
  confidenceScore: number;
  hashMatch: boolean;
  metadataMatch: number;
  licenseOwnership: boolean;
  report: any;
}> {
  // Hash comparison
  const hashMatch = reportedContent.hash
    ? reportedContent.hash === ipAsset.ipfsHash
    : false;

  // Metadata comparison (simplified - in production, use AI/ML)
  let metadataMatch = 0;
  if (reportedContent.metadata) {
    // Simple keyword matching
    const ipTitle = ipAsset.title.toLowerCase();
    const reportedTitle = reportedContent.metadata.title?.toLowerCase() || '';
    
    if (reportedTitle.includes(ipTitle) || ipTitle.includes(reportedTitle)) {
      metadataMatch += 0.5;
    }

    // Category matching
    if (reportedContent.metadata.category === ipAsset.category) {
      metadataMatch += 0.3;
    }

    // Tag matching
    const ipTags = ipAsset.tags.map((t: string) => t.toLowerCase());
    const reportedTags = (reportedContent.metadata.tags || []).map((t: string) => t.toLowerCase());
    const commonTags = ipTags.filter((tag: string) => reportedTags.includes(tag));
    if (commonTags.length > 0) {
      metadataMatch += (commonTags.length / Math.max(ipTags.length, reportedTags.length)) * 0.2;
    }
  }

  // License ownership verification
  const activeLicenses = await prisma.license.findMany({
    where: {
      ipId: ipAsset.id,
      status: 'active',
    },
  });

  const licenseOwnership = activeLicenses.length > 0;

  // Calculate confidence score
  let confidenceScore = 0;
  if (hashMatch) {
    confidenceScore = 95; // High confidence if hash matches
  } else {
    confidenceScore = Math.min(metadataMatch * 100, 85); // Lower confidence based on metadata
  }

  const report = {
    hashMatch,
    metadataMatch: Math.round(metadataMatch * 100) / 100,
    licenseOwnership,
    ipAssetId: ipAsset.id,
    ipAssetTitle: ipAsset.title,
    reportedAt: new Date().toISOString(),
    analysis: {
      hashComparison: hashMatch ? 'exact_match' : 'no_match',
      metadataSimilarity: Math.round(metadataMatch * 100),
      licenseStatus: licenseOwnership ? 'licensed' : 'unlicensed',
    },
  };

  return {
    confidenceScore: Math.round(confidenceScore),
    hashMatch,
    metadataMatch,
    licenseOwnership,
    report,
  };
}

/**
 * Submit a violation report
 */
export async function submitReport(input: SubmitReportInput) {
  const { ipId, reporterWallet, url, screenshotUrl, fileUrl, fileContent } = input;

  // Get IP asset
  const ipAsset = await prisma.iPAsset.findUnique({
    where: { id: ipId },
  });

  if (!ipAsset) {
    throw new Error('IP Asset not found');
  }

  // Upload file content if provided
  let uploadedHash: string | undefined;
  if (fileContent) {
    const { ipfsHash } = await uploadToIPFS(fileContent, `report-${Date.now()}`);
    uploadedHash = ipfsHash;
  }

  // Generate authenticity report
  const authenticityData = await generateAuthenticityReport(ipAsset, {
    hash: uploadedHash,
    url,
    metadata: {
      // In production, extract metadata from URL/content
      title: '',
      category: '',
      tags: [],
    },
  });

  // Save report to database
  const report = await prisma.report.create({
    data: {
      ipId,
      reporterWallet: reporterWallet.toLowerCase(),
      url,
      screenshotUrl,
      fileUrl: uploadedHash ? `ipfs://${uploadedHash}` : fileUrl,
      confidenceScore: authenticityData.confidenceScore,
      status: 'pending',
      authenticityReport: authenticityData.report as any,
    },
    include: {
      ipAsset: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return report;
}

/**
 * Get reports for an IP Asset
 */
export async function getReportsByIP(ipId: string) {
  return prisma.report.findMany({
    where: { ipId },
    include: {
      reporter: {
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
 * Get report by ID
 */
export async function getReportById(reportId: string) {
  return prisma.report.findUnique({
    where: { id: reportId },
    include: {
      ipAsset: true,
      reporter: true,
    },
  });
}

/**
 * Update report status
 */
export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'verified' | 'false_positive' | 'resolved'
) {
  return prisma.report.update({
    where: { id: reportId },
    data: { status },
  });
}

