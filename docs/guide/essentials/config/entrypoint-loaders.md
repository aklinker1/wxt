# Entrypoint Loaders

To generate the manifest and other files at build-time, WXT must import each entrypoint to get their options, like content script `matches`. For HTML files, this is easy. For JS/TS entrypoints, the process is more complicated.

When loading your JS/TS entrypoints, they are imported into a NodeJS environment, not the `browser` environment that they normally run in. This can lead to issues commonly seen when running browser-only code in a NodeJS environment, like missing global variables.

WXT does several pre-processing steps to try and prevent errors during this process:

1. Use `linkedom` to make a small set of browser globals (`window`, `document`, etc) available.
2. Use `@webext-core/fake-browser` to create a fake version of the `chrome` and `browser` globals expected by extensions.
3. Pre-process the JS/TS code, stripping out the `main` function then tree-shaking unused code from the file

However, this process is not perfect. It doesn't setup all the globals found in the browser and the APIs may behave differently. As such, **_you should avoid using browser or extension APIs outside the `main` function of your entrypoints!_**

:::tip
If you're running into errors while importing entrypoints, run `wxt prepare --debug` to see more details about this process. When debugging, WXT will print out the pre-processed code to help you identify issues.
:::

Once the environment has been polyfilled and your code pre-processed, it's up the entrypoint loader to import your code, extracting the options from the default export.
