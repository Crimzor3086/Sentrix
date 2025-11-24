import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { walletAddress: '0x1111111111111111111111111111111111111111' },
    update: {},
    create: {
      walletAddress: '0x1111111111111111111111111111111111111111',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { walletAddress: '0x2222222222222222222222222222222222222222' },
    update: {},
    create: {
      walletAddress: '0x2222222222222222222222222222222222222222',
    },
  });

  console.log('✅ Created sample users');

  // Create sample IP assets
  const ipAsset1 = await prisma.iPAsset.create({
    data: {
      title: 'Sample IP Asset 1',
      description: 'This is a sample IP asset for testing',
      creatorWallet: user1.walletAddress,
      ipfsHash: 'QmSampleHash1',
      metadataHash: 'QmMetadataHash1',
      category: 'Art',
      tags: ['digital', 'art', 'nft'],
    },
  });

  console.log('✅ Created sample IP assets');

  // Create sample license
  const license1 = await prisma.license.create({
    data: {
      ipId: ipAsset1.id,
      creatorWallet: user1.walletAddress,
      termsJson: {
        commercialRights: true,
        distributionRights: true,
        exclusivity: false,
        duration: 365,
        price: '1000000000000000000', // 1 ETH in wei
      },
      status: 'pending',
    },
  });

  console.log('✅ Created sample licenses');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

