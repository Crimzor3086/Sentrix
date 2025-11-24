import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.MANTLE_SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
  throw new Error("Missing MANTLE_SEPOLIA_RPC_URL or PRIVATE_KEY environment variables");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadArtifact = (relativePath) => {
  const artifactPath = path.resolve(__dirname, relativePath);
  return JSON.parse(readFileSync(artifactPath, "utf8"));
};

const registryArtifact = loadArtifact("../artifacts/contracts/SentrixRegistry.sol/SentrixRegistry.json");
const licensingArtifact = loadArtifact("../artifacts/contracts/SentrixLicensing.sol/SentrixLicensing.json");

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

console.log(`Deploying with account ${wallet.address}`);

const deployRegistry = async () => {
  console.log("Deploying SentrixRegistry...");
  const factory = new ethers.ContractFactory(registryArtifact.abi, registryArtifact.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log(`SentrixRegistry deployed at ${address}`);
  return address;
};

const deployLicensing = async (registryAddress) => {
  console.log("Deploying SentrixLicensing...");
  const factory = new ethers.ContractFactory(licensingArtifact.abi, licensingArtifact.bytecode, wallet);
  const contract = await factory.deploy(registryAddress);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log(`SentrixLicensing deployed at ${address}`);
  return address;
};

const main = async () => {
  const registryAddress = await deployRegistry();
  const licensingAddress = await deployLicensing(registryAddress);

  console.log("\nDeployment complete:");
  console.log(`Registry : ${registryAddress}`);
  console.log(`Licensing: ${licensingAddress}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

