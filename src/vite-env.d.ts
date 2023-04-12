/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SUPBASE_URL: string
  readonly SUPBASE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
