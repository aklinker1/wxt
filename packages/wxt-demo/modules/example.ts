import { defineWxtModule } from 'wxt/modules';

// Example of adding option types to wxt config file
export interface ExampleModuleOptions {
  a: string;
  b?: string;
}
declare module 'wxt' {
  interface InlineConfig {
    example?: ExampleModuleOptions;
  }
}

export default defineWxtModule<ExampleModuleOptions>({
  configKey: 'example',
  setup(wxt, options) {
    wxt.logger.info('Example module with options:', options);
  },
});
