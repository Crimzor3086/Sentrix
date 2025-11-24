import hre from "hardhat";

async function main() {
  console.log("Deploying SentrixRegistry...");
  const registry = await hre.ethers.deployContract("SentrixRegistry");
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`SentrixRegistry deployed at ${registryAddress}`);

  console.log("Deploying SentrixLicensing...");
  const licensing = await hre.ethers.deployContract("SentrixLicensing", [registryAddress]);
  await licensing.waitForDeployment();
  const licensingAddress = await licensing.getAddress();
  console.log(`SentrixLicensing deployed at ${licensingAddress}`);

  return { registryAddress, licensingAddress };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

