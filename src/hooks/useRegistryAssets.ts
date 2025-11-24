import { useWallet } from "@/contexts/WalletContext";
import { useQuery } from "@tanstack/react-query";
import { getRegistryContract } from "@/lib/contracts";
import { decodeMetadataURI } from "@/lib/metadata";

export type RegistryAsset = {
  id: string;
  title: string;
  category: string;
  owner: string;
  metadataURI: string;
  createdAt: number;
  description?: string;
  reference?: string;
};

export const mapRegistryAsset = (raw: any): RegistryAsset => {
  const metadata = decodeMetadataURI(raw.metadataURI ?? raw[4] ?? "");

  return {
    id: (raw.id ?? raw[0]).toString(),
    owner: raw.owner ?? raw[1],
    title: raw.title ?? raw[2],
    category: raw.category ?? raw[3],
    metadataURI: raw.metadataURI ?? raw[4] ?? "",
    createdAt: Number(raw.createdAt ?? raw[5] ?? 0),
    description: metadata?.description,
    reference: metadata?.reference,
  };
};

export const useRegistryAssets = () => {
  const { address } = useWallet();

  return useQuery({
    queryKey: ["registryAssets", address],
    enabled: Boolean(address),
    queryFn: async () => {
      const contract = await getRegistryContract();
      const assets = await contract.getAssetsByOwner(address);
      return assets.map(mapRegistryAsset);
    },
  });
};

export const useRegistryAsset = (assetId?: string) => {
  return useQuery({
    queryKey: ["registryAsset", assetId],
    enabled: Boolean(assetId),
    queryFn: async () => {
      const contract = await getRegistryContract();
      const asset = await contract.getAsset(assetId);
      return mapRegistryAsset(asset);
    },
  });
};

