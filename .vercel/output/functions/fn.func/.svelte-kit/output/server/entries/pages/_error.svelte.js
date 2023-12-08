import { s as subscribe } from "../../chunks/utils.js";
import { c as create_ssr_component, e as escape } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<div class="card border shadow-lg py-6 px-2 max-w-sm mx-auto text-center mt-40"><div class="text-4xl font-bold font-mono">${escape($page.status)}</div> <div class="text-2xl">${escape($page.error?.message)}</div> <a href="/" class="btn btn-primary mx-auto mt-5 w-40" data-svelte-h="svelte-1rcyu78">Go Home</a></div>`;
});
export {
  Error as default
};
