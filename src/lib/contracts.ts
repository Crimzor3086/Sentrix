import { BrowserProvider, Contract, ethers } from "ethers";
import { sentrixRegistryAbi } from "./abis/sentrixRegistry";
import { sentrixLicensingAbi } from "./abis/sentrixLicensing";

const getProvider = async () => {
  const { ethereum } = window;
  if (!ethereum) {
    throw new Error("MetaMask provider not found");
  }

  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  return { provider, signer };
};

const getAddress = (key: "VITE_SENTRIX_REGISTRY_ADDRESS" | "VITE_SENTRIX_LICENSING_ADDRESS") => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`${key} is not configured in your environment`);
  }
  return value;
};

export const getRegistryContract = async () => {
  const { signer } = await getProvider();
  return new Contract(getAddress("VITE_SENTRIX_REGISTRY_ADDRESS"), sentrixRegistryAbi, signer);
};

export const getLicensingContract = async () => {
  const { signer } = await getProvider();
  return new Contract(getAddress("VITE_SENTRIX_LICENSING_ADDRESS"), sentrixLicensingAbi, signer);
};

export const parseEther = (value: string) => ethers.parseEther(value);
export const formatEther = (value: bigint) => ethers.formatEther(value);

