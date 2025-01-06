// Types required to make the virtual modules happy.

declare module 'virtual:user-background-entrypoint' {
  const definition: import('wxt').BackgroundDefinition;
  export default definition;
}

declare module 'virtual:user-content-script-isolated-world-entrypoint' {
  const definition: import('wxt').IsolatedWorldContentScriptDefinition;
  export default definition;
}

declare module 'virtual:user-content-script-main-world-entrypoint' {
  const definition: import('wxt').MainWorldContentScriptDefinition;
  export default definition;
}

declare module 'virtual:user-unlisted-script-entrypoint' {
  const definition: import('wxt').UnlistedScriptDefinition;
  export default definition;
}

declare module 'wxt/browser' {
  export { chrome as browser };
}

declare module 'virtual:wxt-plugins' {
  export function initPlugins(): void;
}
