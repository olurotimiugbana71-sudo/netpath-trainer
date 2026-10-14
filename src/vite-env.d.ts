/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LICENSE_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}