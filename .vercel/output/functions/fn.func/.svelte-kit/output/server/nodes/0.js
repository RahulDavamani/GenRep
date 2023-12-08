import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.vKy52Gl9.js","_app/immutable/chunks/scheduler.3ReU94nE.js","_app/immutable/chunks/index.NEorA02J.js","_app/immutable/chunks/stores.mR6HpIOz.js","_app/immutable/chunks/singletons.H_Q0zzLR.js","_app/immutable/chunks/Icon.IrfYofK7.js","_app/immutable/chunks/parse.ubpsR57U.js","_app/immutable/chunks/ui.store.sUjNR-QD.js","_app/immutable/chunks/each.6w4Ej4nR.js"];
export const stylesheets = ["_app/immutable/assets/0.RMVhdgD2.css"];
export const fonts = [];
