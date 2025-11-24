import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers available. Check PRIVATE_KEY in .env");
  }
  const deployer = signers[0];

  console.log("Deploying contracts with account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy IPAssetRegistry
  console.log("\nDeploying IPAssetRegistry...");
  const IPAssetRegistry = await ethers.getContractFactory("IPAssetRegistry");
  const ipAssetRegistry = await IPAssetRegistry.deploy(deployer.address);
  await ipAssetRegistry.waitForDeployment();
  const ipAssetRegistryAddress = await ipAssetRegistry.getAddress();
  console.log("IPAssetRegistry deployed to:", ipAssetRegistryAddress);
  
  // Wait for a few confirmations
  console.log("Waiting for confirmations...");
  await ipAssetRegistry.deploymentTransaction()?.wait(2);

  // Deploy LicensingModule
  console.log("\nDeploying LicensingModule...");
  const LicensingModule = await ethers.getContractFactory("LicensingModule");
  const licensingModule = await LicensingModule.deploy(ipAssetRegistryAddress, deployer.address);
  await licensingModule.waitForDeployment();
  const licensingModuleAddress = await licensingModule.getAddress();
  console.log("LicensingModule deployed to:", licensingModuleAddress);
  
  // Wait for a few confirmations
  console.log("Waiting for confirmations...");
  await licensingModule.deploymentTransaction()?.wait(2);

  // Save deployment info
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    contracts: {
      IPAssetRegistry: ipAssetRegistryAddress,
      LicensingModule: licensingModuleAddress,
    },
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network.name}-${network.chainId}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n✅ Deployment complete!");
  console.log("\nContract addresses:");
  console.log("  IPAssetRegistry:", ipAssetRegistryAddress);
  console.log("  LicensingModule:", licensingModuleAddress);
  console.log("\nDeployment info saved to:", deploymentFile);
  console.log("\n📝 Update your .env file with these addresses:");
  console.log(`STORY_IP_ASSET_REGISTRY_ADDRESS=${ipAssetRegistryAddress}`);
  console.log(`STORY_LICENSING_MODULE_ADDRESS=${licensingModuleAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

