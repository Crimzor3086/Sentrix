/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRIX_REGISTRY_ADDRESS?: string;
  readonly VITE_SENTRIX_LICENSING_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
