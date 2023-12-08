import * as server from '../entries/pages/settings/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/settings/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/settings/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.dYQMImDg.js","_app/immutable/chunks/scheduler.3ReU94nE.js","_app/immutable/chunks/index.NEorA02J.js","_app/immutable/chunks/Icon.IrfYofK7.js","_app/immutable/chunks/each.6w4Ej4nR.js","_app/immutable/chunks/ui.store.sUjNR-QD.js","_app/immutable/chunks/singletons.H_Q0zzLR.js","_app/immutable/chunks/client.XrBCSIrM.js","_app/immutable/chunks/stores.mR6HpIOz.js","_app/immutable/chunks/databaseProviders.3xLtxgey.js"];
export const stylesheets = [];
export const fonts = [];
