/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPBASE_URL: string
  readonly VITE_SUPBASE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
