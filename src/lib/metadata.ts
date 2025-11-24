export type SentrixMetadata = {
  title: string;
  description: string;
  category: string;
  reference?: string;
  createdAt: number;
};

const encodeBase64 = (value: string) =>
  typeof window !== "undefined"
    ? window.btoa(unescape(encodeURIComponent(value)))
    : Buffer.from(value, "utf-8").toString("base64");

export const encodeMetadataURI = (metadata: SentrixMetadata) => {
  const payload = JSON.stringify(metadata);
  return `data:application/json;base64,${encodeBase64(payload)}`;
};

export const decodeMetadataURI = (uri: string): SentrixMetadata | null => {
  if (!uri.startsWith("data:application/json;base64,")) {
    return null;
  }

  const base64 = uri.replace("data:application/json;base64,", "");
  try {
    const json =
      typeof window !== "undefined"
        ? decodeURIComponent(escape(window.atob(base64)))
        : Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
};

