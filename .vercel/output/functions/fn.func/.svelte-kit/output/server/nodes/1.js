

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.TxHXHIw9.js","_app/immutable/chunks/scheduler.3ReU94nE.js","_app/immutable/chunks/index.NEorA02J.js","_app/immutable/chunks/stores.mR6HpIOz.js","_app/immutable/chunks/singletons.H_Q0zzLR.js"];
export const stylesheets = [];
export const fonts = [];
