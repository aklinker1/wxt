import { defineAppConfig } from '#imports';

declare module 'wxt/utils/define-app-config' {
  export interface WxtAppConfig {
    example: string;
  }
}

export default defineAppConfig({
  example: 'value',
});
