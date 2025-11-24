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

const DEFAULT_CONTRACT_ADDRESSES = {
  VITE_SENTRIX_REGISTRY_ADDRESS: "0xD65143F3861d7fc09514c4e5bDA0264Bd4EE2EF1",
  VITE_SENTRIX_LICENSING_ADDRESS: "0x98E066d8Fe0dCcA41005EB2f3E45179cEbE9FC2C",
} as const;

const getAddress = (key: keyof typeof DEFAULT_CONTRACT_ADDRESSES) => {
  const value = import.meta.env[key];
  if (value && value !== "") {
    return value;
  }

  const fallback = DEFAULT_CONTRACT_ADDRESSES[key];
  if (fallback) {
    if (import.meta.env.MODE !== "production") {
      console.warn(
        `[sentrix] ${key} missing in env, falling back to Mantle Sepolia default (${fallback}).` +
          " Configure real addresses in your .env to silence this warning."
      );
    }
    return fallback;
  }

  throw new Error(`${key} is not configured in your environment`);
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

