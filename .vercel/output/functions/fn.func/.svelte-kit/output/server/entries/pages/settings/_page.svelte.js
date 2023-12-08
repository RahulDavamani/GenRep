import { c as create_ssr_component, v as validate_component, e as escape, a as add_attribute, b as each } from "../../../chunks/ssr.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { s as subscribe } from "../../../chunks/utils.js";
import { u as ui } from "../../../chunks/ui.store.js";
import "@trpc/client";
import "@trpc/server";
import "../../../chunks/index.js";
import "trpc-sveltekit";
import { p as page } from "../../../chunks/stores.js";
import { t as themes, d as databaseProviders } from "../../../chunks/databaseProviders.js";
const UpsertApiKeyModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_ui;
  let $$unsubscribe_page;
  $$unsubscribe_ui = subscribe(ui, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { upsertApiKey } = $$props;
  let zodErrors;
  if ($$props.upsertApiKey === void 0 && $$bindings.upsertApiKey && upsertApiKey !== void 0)
    $$bindings.upsertApiKey(upsertApiKey);
  $$unsubscribe_ui();
  $$unsubscribe_page();
  return `${upsertApiKey ? `<div class="modal modal-open"><div class="modal-box"><div class="flex justify-between items-center mb-4"><div class="text-xl font-bold">${upsertApiKey.id ? `Update API Key` : `Create New API Key`}</div> <button>${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      icon: "mdi:close",
      class: "cursor-pointer text-error",
      width: 20
    },
    {},
    {}
  )}</button></div> <div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-q1so8d">Name</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.name, true)}"${add_attribute("value", upsertApiKey.name, 0)}> ${``}</div> <div class="modal-action"><button class="btn btn-error w-24" data-svelte-h="svelte-1wwof4v">Cancel</button> <button class="btn btn-success w-24">${upsertApiKey.id ? `Update` : `Create`}</button></div></div></div>` : ``}`;
});
const ApiKeys = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let apiKeys;
  let $$unsubscribe_ui;
  let $page, $$unsubscribe_page;
  $$unsubscribe_ui = subscribe(ui, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let upsertApiKey;
  let showKeys = [];
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    ({ apiKeys } = $page.data);
    $$rendered = `<div class="flex justify-between items-center mt-10 mb-6"><div class="flex gap-2 items-center text-lg font-semibold">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:key" }, {}, {})}
		API Keys: <span class="font-mono">(${escape(apiKeys.length)})</span></div> <button class="btn btn-sm btn-success">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:key-plus", width: 20 }, {}, {})} Create API Key</button></div> <div class="overflow-x-auto rounded-lg shadow-sm"><table class="table"><thead class="bg-base-200" data-svelte-h="svelte-x70lz4"><tr><th></th> <th>Name</th> <th>Key</th> <th></th></tr></thead> <tbody>${apiKeys.length ? each(apiKeys, (apiKey) => {
      let { id, name } = apiKey;
      return ` <tr class="hover"><td class="w-1"><button>${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "mdi:square-edit-outline",
          width: 20,
          class: "text-info"
        },
        {},
        {}
      )} </button></td> <th>${escape(name)}</th> <td class="flex items-center gap-4">${showKeys.includes(id) ? `${escape(id)} <button>${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:eye", width: 16 }, {}, {})} </button>` : `################
							<button>${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:eye-off", width: 16 }, {}, {})} </button>`} <button>${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "material-symbols:content-copy-rounded",
          width: 16
        },
        {},
        {}
      )} </button></td> <td class="w-1"><button>${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "mdi:delete-forever",
          width: 22,
          class: "text-error"
        },
        {},
        {}
      )} </button></td> </tr>`;
    }) : `<tr data-svelte-h="svelte-xpi8c6"><td${add_attribute("colspan", 4, 0)} class="text-center py-5">There are API Keys found</td> </tr>`}</tbody></table></div> ${validate_component(UpsertApiKeyModal, "UpsertApiKeyModal").$$render(
      $$result,
      { upsertApiKey },
      {
        upsertApiKey: ($$value) => {
          upsertApiKey = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_ui();
  $$unsubscribe_page();
  return $$rendered;
});
const Themes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let data;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  data = $page.data;
  $$unsubscribe_page();
  return `<div class="mt-10"><div class="text-lg font-semibold mb-1" data-svelte-h="svelte-147j856">Themes:</div> <div class="flex flex-wrap justify-around gap-x-6">${each(themes, (th) => {
    return `  <div${add_attribute("data-theme", th, 0)} class="${"card w-44 bg-base-100 my-3 lg:m-6 border cursor-pointer " + escape(data.theme === th && "outline outline-primary", true)}"><div class="card-body p-0 text-center"><div class="grid grid-cols-5 grid-rows-3"><div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4"><div class="flex-grow text-sm font-bold">${escape(th.toUpperCase())}</div> <div class="flex flex-shrink-0 flex-wrap gap-1" data-svelte-h="svelte-a8u2sy"><div class="bg-primary w-2 rounded"></div> <div class="bg-secondary w-2 rounded"></div> <div class="bg-accent w-2 rounded"></div> <div class="bg-neutral w-2 rounded"></div> </div></div> </div></div> </div>`;
  })}</div></div>`;
});
const UpsertDatabaseModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_ui;
  let $$unsubscribe_page;
  $$unsubscribe_ui = subscribe(ui, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { upsertDatabase } = $$props;
  let zodErrors;
  if ($$props.upsertDatabase === void 0 && $$bindings.upsertDatabase && upsertDatabase !== void 0)
    $$bindings.upsertDatabase(upsertDatabase);
  $$unsubscribe_ui();
  $$unsubscribe_page();
  return `${upsertDatabase ? `<div class="modal modal-open"><div class="modal-box max-w-xl"><div class="flex justify-between items-center mb-4"><div class="text-xl font-bold">${upsertDatabase.id ? `Update Database` : `Add Database`}</div> <button>${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      icon: "mdi:close",
      class: "cursor-pointer text-error",
      width: 20
    },
    {},
    {}
  )}</button></div>  <div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-q1so8d">Name</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.name, true)}"${add_attribute("value", upsertDatabase.name, 0)}> ${``}</div>  <div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-1obftgf">Provider</div> <select placeholder="Type here" class="select select-bordered w-full">${each(databaseProviders, ({ name, client }) => {
    return `<option${add_attribute("value", client, 0)}>${escape(name)}</option>`;
  })}</select></div>  <div class="tabs mt-8 mb-4"><button class="${"tab tab-bordered w-1/2 text-lg font-semibold " + escape(upsertDatabase.connectionType === "STRING" && "tab-active", true)}">Connection String</button> <button class="${"tab tab-bordered w-1/2 text-lg font-semibold " + escape(upsertDatabase.connectionType === "OPTIONS" && "tab-active", true)}">Connection Options</button></div> ${upsertDatabase.connectionType === "STRING" ? ` <div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-1q5rxj3">Connection String</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.connectionString, true)}"${add_attribute("value", upsertDatabase.connectionString, 0)}> ${``}</div>` : `${upsertDatabase.connectionOption ? ` <div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-1qznt8u">Host</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.connectionOption?.host, true)}"${add_attribute("value", upsertDatabase.connectionOption.host, 0)}> ${``}</div>  <div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-1yyn5dt">Port</div> <input type="number" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.connectionOption?.port, true)}"${add_attribute("value", upsertDatabase.connectionOption.port, 0)}> ${``}</div>  <div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-166g8o6">Database Name</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.connectionOption?.databaseName, true)}"${add_attribute("value", upsertDatabase.connectionOption.databaseName, 0)}> ${``}</div>  <div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-sg81p0">Username</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.connectionOption?.username, true)}"${add_attribute("value", upsertDatabase.connectionOption.username, 0)}> ${``}</div>  <div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-3tj1lv">Password</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.connectionOption?.password, true)}"${add_attribute("value", upsertDatabase.connectionOption.password, 0)}> ${``}</div>` : ``}`} <div class="modal-action"><button class="btn btn-error w-24" data-svelte-h="svelte-1wwof4v">Cancel</button> <button class="btn btn-success w-24">${upsertDatabase.id ? `Update` : `Add`}</button></div></div></div>` : ``}`;
});
const Databases = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let databases;
  let $$unsubscribe_ui;
  let $page, $$unsubscribe_page;
  $$unsubscribe_ui = subscribe(ui, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let upsertDatabase;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    ({ databases } = $page.data);
    $$rendered = `<div class="flex justify-between items-center mb-6"><div class="flex gap-2 items-center text-lg font-semibold">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:database" }, {}, {})}
		Databases: <span class="font-mono">(${escape(databases.length)})</span></div> <button class="btn btn-sm btn-success">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:database-plus", width: 20 }, {}, {})} Add Database</button></div> <div class="overflow-x-auto rounded-lg shadow-sm"><table class="table"><thead class="bg-base-200" data-svelte-h="svelte-180dda6"><tr><th></th> <th>Name</th> <th>Provider</th> <th>Connection Type</th> <th></th> <th></th></tr></thead> <tbody>${databases.length ? each(databases, (db) => {
      let { id, name, provider, connectionType } = db, providerName = databaseProviders.find((dbp) => dbp.client === provider)?.name;
      return `  <tr class="hover"><td class="w-1"><button>${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "mdi:square-edit-outline",
          width: 20,
          class: "text-info"
        },
        {},
        {}
      )} </button></td> <th>${escape(name)}</th> <td>${escape(providerName)}</td> <td>${escape(connectionType)}</td> <td class="w-52"><button class="btn btn-xs btn-primary">${validate_component(Icon, "Icon").$$render($$result, { icon: "tabler:plug-connected", width: 16 }, {}, {})}
							Test Connection
						</button></td> <td class="w-1"><button>${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "mdi:delete-forever",
          width: 22,
          class: "text-error"
        },
        {},
        {}
      )} </button></td> </tr>`;
    }) : `<tr data-svelte-h="svelte-yx647s"><td${add_attribute("colspan", 6, 0)} class="text-center py-5">There are Databases found</td> </tr>`}</tbody></table></div> ${validate_component(UpsertDatabaseModal, "UpsertDatabaseModal").$$render(
      $$result,
      { upsertDatabase },
      {
        upsertDatabase: ($$value) => {
          upsertDatabase = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_ui();
  $$unsubscribe_page();
  return $$rendered;
});
const ValidateTokenURL = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let validateTokenUrl = "";
  $$unsubscribe_page();
  return `<div class="form-control w-full mb-8"><div class="label font-semibold justify-start gap-2">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:link", width: 20 }, {}, {})}
		Validate Token URL</div> <div class="join"><input type="text" placeholder="Type here" class="input input-bordered join-item w-full"${add_attribute("value", validateTokenUrl, 0)}> <button class="btn btn-success join-item">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:content-save", width: 18 }, {}, {})}
			Save</button></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="container mx-auto rounded-box shadow py-4"><div class="flex justify-between items-center px-4"><button class="btn btn-ghost">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:chevron-left", width: 22 }, {}, {})} Back</button> <div class="text-center text-2xl font-semibold" data-svelte-h="svelte-o0zdza">Settings</div> <button class="btn btn-ghost opacity-0 pointer-events-none">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:chevron-left", width: 22 }, {}, {})} Back</button></div> <div class="divider mt-2"></div> <div class="px-8">${validate_component(ValidateTokenURL, "ValidateTokenUrl").$$render($$result, {}, {}, {})} ${validate_component(Databases, "Databases").$$render($$result, {}, {}, {})} ${validate_component(ApiKeys, "ApiKeys").$$render($$result, {}, {}, {})} ${validate_component(Themes, "Themes").$$render($$result, {}, {}, {})}</div></div>`;
});
export {
  Page as default
};
