import { useQuery } from "@tanstack/react-query";
import { getLicensingContract } from "@/lib/contracts";
import { useWallet } from "@/contexts/WalletContext";

export enum LicenseStatus {
  Pending = 0,
  Active = 1,
  Revoked = 2,
}

export type LicenseListing = {
  id: string;
  assetId: string;
  licensor: string;
  licensee: string;
  fee: bigint;
  startDate: number;
  endDate: number;
  termsURI: string;
  status: LicenseStatus;
};

const mapLicense = (raw: any): LicenseListing => ({
  id: (raw.id ?? raw[0]).toString(),
  assetId: (raw.assetId ?? raw[1]).toString(),
  licensor: raw.licensor ?? raw[2],
  licensee: raw.licensee ?? raw[3],
  fee: BigInt(raw.fee ?? raw[4] ?? 0),
  startDate: Number(raw.startDate ?? raw[5] ?? 0),
  endDate: Number(raw.endDate ?? raw[6] ?? 0),
  termsURI: raw.termsURI ?? raw[7] ?? "",
  status: Number(raw.status ?? raw[8] ?? 0) as LicenseStatus,
});

export const useAssetLicenses = (assetId?: string) => {
  return useQuery({
    queryKey: ["assetLicenses", assetId],
    enabled: Boolean(assetId),
    queryFn: async () => {
      const contract = await getLicensingContract();
      const licenses = await contract.getLicensesByAsset(assetId);
      return licenses.map(mapLicense);
    },
  });
};

export const useOpenLicenses = () => {
  const { address } = useWallet();
  return useQuery({
    queryKey: ["openLicenses", address],
    enabled: Boolean(address),
    queryFn: async () => {
      const contract = await getLicensingContract();
      const listings = await contract.getOpenLicenses();
      return listings.map(mapLicense);
    },
  });
};

