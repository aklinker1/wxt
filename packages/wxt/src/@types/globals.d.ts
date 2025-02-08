declare const __DEV_SERVER_ORIGIN__: string;

// Globals defined by the vite-plugins/devServerGlobals.ts and utils/globals.ts
interface ImportMetaEnv {
  readonly COMMAND: WxtCommand;
  readonly MANIFEST_VERSION: 2 | 3;
  readonly ENTRYPOINT: string;
}
