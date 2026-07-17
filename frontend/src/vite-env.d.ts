/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    /** `http` (Express / future remote API) or `local` (browser session + rules). Default: http */
    readonly VITE_DATA_SOURCE?: 'http' | 'local' | string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
