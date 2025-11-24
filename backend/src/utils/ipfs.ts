import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';
import env from '../config/env.js';

const pinata = new pinataSDK({
  pinataApiKey: env.PINATA_API_KEY,
  pinataSecretApiKey: env.PINATA_SECRET_KEY,
});

/**
 * Upload file to IPFS via Pinata
 */
export async function uploadToIPFS(
  file: Buffer | string,
  fileName?: string
): Promise<{ ipfsHash: string; pinataUrl: string }> {
  try {
    let result;

    if (typeof file === 'string') {
      // Text content
      const options = {
        pinataMetadata: {
          name: fileName || `sentrix-${Date.now()}`,
        },
        pinataOptions: {
          cidVersion: 0 as 0,
        },
      };

      result = await pinata.pinJSONToIPFS(JSON.parse(file), options);
    } else {
      // Buffer/file
      const readable = Readable.from(file);
      const options = {
        pinataMetadata: {
          name: fileName || `sentrix-${Date.now()}`,
        },
        pinataOptions: {
          cidVersion: 0 as 0,
        },
      };

      result = await pinata.pinFileToIPFS(readable, options);
    }

    const ipfsHash = result.IpfsHash;
    const pinataUrl = `${env.PINATA_GATEWAY_URL}${ipfsHash}`;

    return { ipfsHash, pinataUrl };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Upload JSON metadata to IPFS
 */
export async function uploadMetadata(metadata: Record<string, any>): Promise<string> {
  try {
    const result = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `sentrix-metadata-${Date.now()}`,
      },
    });

    return result.IpfsHash;
  } catch (error) {
    console.error('Metadata upload error:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Get IPFS URL from hash
 */
export function getIPFSUrl(ipfsHash: string): string {
  return `${env.PINATA_GATEWAY_URL}${ipfsHash}`;
}

