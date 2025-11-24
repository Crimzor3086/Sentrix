import { Buffer } from "buffer";
const encodeBase64 = (value: string) => {
  if (typeof window !== "undefined" && window.btoa) {
    return window.btoa(unescape(encodeURIComponent(value)));
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf-8").toString("base64");
  }
  throw new Error("No base64 encoder available in this environment");
};

const encodeJsonDataUri = (payload: unknown) => {
  const json = JSON.stringify(payload);
  return `data:application/json;base64,${encodeBase64(json)}`;
};

const uploadJsonToIpfs = async (payload: unknown) => {
  const token = import.meta.env.VITE_WEB3_STORAGE_TOKEN;
  if (!token) {
    return null;
  }

  const response = await fetch("https://api.web3.storage/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`IPFS upload failed with status ${response.status}`);
  }

  const data = await response.json();
  return typeof data.cid === "string" ? data.cid : null;
};

export const persistLicenseTerms = async (payload: Record<string, unknown>) => {
  try {
    const cid = await uploadJsonToIpfs(payload);
    if (cid) {
      return `ipfs://${cid}`;
    }
  } catch (error) {
    console.warn("[sentrix] Failed to upload license terms to IPFS, using data URI fallback.", error);
  }

  return encodeJsonDataUri(payload);
};

