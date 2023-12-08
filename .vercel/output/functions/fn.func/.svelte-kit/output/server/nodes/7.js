import * as server from '../entries/pages/view-report/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/view-report/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/view-report/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.FMH01XUf.js","_app/immutable/chunks/scheduler.3ReU94nE.js","_app/immutable/chunks/index.NEorA02J.js","_app/immutable/chunks/ReportCanvas.8U6PJTV8.js","_app/immutable/chunks/each.6w4Ej4nR.js","_app/immutable/chunks/singletons.H_Q0zzLR.js","_app/immutable/chunks/client.XrBCSIrM.js","_app/immutable/chunks/ui.store.sUjNR-QD.js","_app/immutable/chunks/stores.mR6HpIOz.js"];
export const stylesheets = ["_app/immutable/assets/ReportCanvas.h2N-adir.css"];
export const fonts = [];
