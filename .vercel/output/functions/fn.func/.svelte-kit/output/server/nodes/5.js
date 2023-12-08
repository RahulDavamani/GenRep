import * as server from '../entries/pages/report-maker/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/report-maker/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/report-maker/+page.server.ts";
export const imports = ["_app/immutable/nodes/5._HYguXJk.js","_app/immutable/chunks/scheduler.3ReU94nE.js","_app/immutable/chunks/index.NEorA02J.js","_app/immutable/chunks/Icon.IrfYofK7.js","_app/immutable/chunks/each.6w4Ej4nR.js","_app/immutable/chunks/ReportCanvas.8U6PJTV8.js","_app/immutable/chunks/singletons.H_Q0zzLR.js","_app/immutable/chunks/client.XrBCSIrM.js","_app/immutable/chunks/ui.store.sUjNR-QD.js","_app/immutable/chunks/stores.mR6HpIOz.js","_app/immutable/chunks/databaseProviders.3xLtxgey.js"];
export const stylesheets = ["_app/immutable/assets/ReportCanvas.h2N-adir.css"];
export const fonts = [];
