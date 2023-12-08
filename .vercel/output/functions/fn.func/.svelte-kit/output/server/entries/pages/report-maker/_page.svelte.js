import { s as subscribe, a as set_store_value } from "../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, b as each, a as add_attribute, e as escape } from "../../../chunks/ssr.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { r as reportMaker, a as replaceQueryParams, R as ReportCanvas } from "../../../chunks/ReportCanvas.js";
import { t as themes, d as databaseProviders } from "../../../chunks/databaseProviders.js";
import "@trpc/client";
import "@trpc/server";
import "../../../chunks/index.js";
import { p as page } from "../../../chunks/stores.js";
import "../../../chunks/reportSchema.js";
import { c as componentTypesList } from "../../../chunks/componentTypes.js";
import cloneDeep from "lodash.clonedeep";
const SelectTheme = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  $$unsubscribe_reportMaker();
  return `${$reportMaker.showSelectTheme ? `<div class="modal modal-open"><div class="modal-box max-w-5xl"><div class="flex justify-between"><div class="text-lg font-semibold mb-1" data-svelte-h="svelte-147j856">Themes:</div> <button class="btn btn-sm btn-circle btn-link text-error">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:close", width: 20 }, {}, {})}</button></div> <div class="flex flex-wrap justify-around gap-x-6">${each(themes, (th) => {
    return `  <div${add_attribute("data-theme", th, 0)} class="${"card w-44 bg-base-100 my-3 lg:m-6 border cursor-pointer " + escape($reportMaker.upsertReport.theme === th && "outline outline-primary", true)}"><div class="card-body p-0"><div class="grid grid-cols-5 grid-rows-3"><div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4"><div class="flex-grow text-sm font-bold">${escape(th.toUpperCase())}</div> <div class="flex flex-shrink-0 flex-wrap gap-1" data-svelte-h="svelte-1y3ilw8"><div class="bg-primary w-2 rounded"></div> <div class="bg-secondary w-2 rounded"></div> <div class="bg-accent w-2 rounded"></div> <div class="bg-neutral w-2 rounded"></div> </div></div> </div></div> </div>`;
  })}</div></div></div>` : ``}`;
});
const ReportForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let zodErrors;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  ({ zodErrors } = $reportMaker);
  $$unsubscribe_reportMaker();
  return `<div class="collapse collapse-arrow rounded-b-none"><input type="checkbox" class="peer" ${"checked"}> <div class="collapse-title"><div class="flex items-center gap-2 text-lg font-semibold">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:tune" }, {}, {})}
			Properties:</div></div> <div class="collapse-content"><div class="flex gap-5 mb-2"><div class="form-control w-full"><div class="label font-semibold" data-svelte-h="svelte-q1so8d">Name</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.name && "input-error", true)}"${add_attribute("value", $reportMaker.upsertReport.name, 0)}> ${zodErrors?.name ? `<div class="label text-xs text-error">${escape(zodErrors.name.message)}</div>` : ``}</div> <div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-25vsaj">Theme</div> <button class="btn btn-primary w-52"${add_attribute("data-theme", $reportMaker.upsertReport.theme, 0)}>${escape($reportMaker.upsertReport.theme)}</button></div></div> <div class="form-control w-full"><div class="label font-semibold justify-start" data-svelte-h="svelte-1kszhv2">Description
				<span class="ml-2 font-normal opacity-80">(optional)</span></div> <textarea placeholder="Type here" class="textarea textarea-bordered w-full">${escape($reportMaker.upsertReport.description || "")}</textarea> ${zodErrors?.description ? `<div class="label text-xs text-error">${escape(zodErrors.description.message)}</div>` : ``}</div></div></div> ${validate_component(SelectTheme, "SelectTheme").$$render($$result, {}, {}, {})}`;
});
const UpsertDatasetModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let databases;
  let upsertDataset;
  let $reportMaker, $$unsubscribe_reportMaker;
  let $page, $$unsubscribe_page;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let zodErrors;
  ({ databases } = $page.data);
  ({ upsertDataset } = $reportMaker);
  $$unsubscribe_reportMaker();
  $$unsubscribe_page();
  return `${upsertDataset && $reportMaker.upsertDataset ? (() => {
    let { query, queryParams } = upsertDataset;
    return ` <div class="modal modal-open"><div class="modal-box max-w-xl"><div class="flex justify-between items-center mb-4"><div class="text-lg font-bold" data-svelte-h="svelte-1hlifoj">Dataset</div> <button>${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        icon: "mdi:close",
        class: "cursor-pointer text-error",
        width: 20
      },
      {},
      {}
    )}</button></div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-q1so8d">Name</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.name, true)}"${add_attribute("value", $reportMaker.upsertDataset.name, 0)}> ${``}</div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-61w5ef">Database</div> <select class="select select-bordered">${each(databases, ({ id, name, provider }) => {
      let providerName = databaseProviders.find((dp) => dp.client === provider)?.name;
      return ` <option${add_attribute("value", id, 0)}>${escape(name)} - ${escape(providerName)}</option>`;
    })}</select></div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-1cbsv9a">Query</div> <textarea placeholder="${"E.g. SELECT " + escape("${columns}", true) + " FROM " + escape("${table}", true)}" class="${"textarea textarea-bordered " + escape(zodErrors?.query, true)}">${escape($reportMaker.upsertDataset.query || "")}</textarea> <span class="label text-xs">Form query parameters by incorporating them within curly braces ${escape("`${}`")}</span> ${``}</div> <div class="font-semibold ml-1 mt-1" data-svelte-h="svelte-m6x1vu">Query Params:</div> <div class="grid grid-cols-2 gap-x-6 gap-y-1">${queryParams.length ? each(queryParams, ({ key }, i) => {
      return `<div class="form-control flex-grow"><div class="label">${escape(key)}</div> <input type="text" placeholder="Type here" class="input input-sm input-bordered"${add_attribute("value", $reportMaker.upsertDataset.queryParams[i].value, 0)}> </div>`;
    }) : `<div class="ml-1" data-svelte-h="svelte-1bmtoea">No Params found in Query</div>`}</div> <div class="mx-1 mt-4"><div class="font-semibold" data-svelte-h="svelte-qx3r4x">Result Query:</div> <!-- HTML_TAG_START -->${replaceQueryParams(query, queryParams, true)}<!-- HTML_TAG_END --></div> <div class="modal-action mt-6"><button class="btn btn-error w-24" data-svelte-h="svelte-1wwof4v">Cancel</button> <button class="btn btn-success w-24" data-svelte-h="svelte-85ho00">Save</button></div></div></div>`;
  })() : ``}`;
});
const ViewDataset = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let datasets;
  let dbData;
  let viewDatasetId;
  let dataset;
  let data;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  ({ upsertReport: { datasets }, dbData, viewDatasetId } = $reportMaker);
  dataset = datasets.find((d) => d.id === viewDatasetId);
  data = dbData[viewDatasetId ?? ""];
  $$unsubscribe_reportMaker();
  return `${dataset && data ? (() => {
    let { name } = dataset;
    return ` <div class="modal modal-open"><div class="modal-box max-w-full"><div class="flex justify-between items-center mb-6"><div class="text-xl font-bold">${escape(name)}</div> <button>${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        icon: "mdi:close",
        class: "cursor-pointer text-error",
        width: 20
      },
      {},
      {}
    )}</button></div> <div class="overflow-x-auto border shadow rounded-lg"><table class="table table-xs"><thead class="bg-base-200"><tr>${each(Object.keys(data[0]), (key) => {
      return `<th>${escape(key)}</th>`;
    })}</tr></thead> <tbody>${each(data, (row) => {
      return `<tr class="hover">${each(Object.values(row), (value) => {
        return `<td>${escape(value)}</td>`;
      })} </tr>`;
    })}</tbody></table></div></div></div>`;
  })() : ``}`;
});
const Datasets = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let databases;
  let datasets;
  let $reportMaker, $$unsubscribe_reportMaker;
  let $page, $$unsubscribe_page;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  ({ databases } = $page.data);
  ({ datasets } = $reportMaker.upsertReport);
  $$unsubscribe_reportMaker();
  $$unsubscribe_page();
  return `<div class="collapse collapse-arrow"><input type="checkbox" class="peer" ${"checked"}> <div class="collapse-title"><div class="flex items-center gap-2 text-lg font-semibold">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      icon: "material-symbols:data-table-outline-rounded"
    },
    {},
    {}
  )}
			Datasets: <span class="font-mono">(${escape(datasets.length)})</span> <button class="z-10 text-success">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:add-circle", width: 24 }, {}, {})}</button></div></div> <div class="collapse-content"><div class="overflow-x-auto rounded-lg shadow-sm px-1 mt-2"><table class="table"><thead class="bg-base-200"><tr><th></th> <th data-svelte-h="svelte-13ju7y1">Name</th> <th data-svelte-h="svelte-18t74cf">Database</th> <th data-svelte-h="svelte-cdwzta">Query</th> <th class="text-center" data-svelte-h="svelte-16pt770">DB Data</th> <th><button class="btn btn-xs btn-outline btn-primary w-full">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:check-all", width: 18 }, {}, {})}
								Fetch All Data</button></th> <th></th></tr></thead> <tbody>${each(datasets, ({ id, name, databaseId, query, queryParams }) => {
    let database = databases.find((db) => db.id === databaseId), providerName = databaseProviders.find((dp) => dp.client === database?.provider)?.name, resultQuery = replaceQueryParams(query, queryParams, true);
    return `   <tr><td class="w-1"><button class="flex">${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        icon: "mdi:square-edit-outline",
        width: 20,
        class: "text-info"
      },
      {},
      {}
    )} </button></td> <td class="font-semibold">${escape(name)}</td> <td>${escape(database?.name)} - ${escape(providerName)}</td> <td><!-- HTML_TAG_START -->${resultQuery}<!-- HTML_TAG_END --></td> <td class="w-40">${!$reportMaker.dbData[id] ? `<div class="badge badge-neutral w-full" data-svelte-h="svelte-1gd1eqq">Not Fetched</div>` : `<button class="btn btn-xs btn-success w-full" data-svelte-h="svelte-1x2uw9n">View Data
									</button>`}</td> <td class="w-48"><button class="btn btn-xs btn-primary w-full" data-svelte-h="svelte-1kte9j8">Fetch Data
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
  })}</tbody></table></div></div></div> ${validate_component(UpsertDatasetModal, "UpsertDatasetModal").$$render($$result, {}, {}, {})} ${validate_component(ViewDataset, "ViewDataset").$$render($$result, {}, {}, {})}`;
});
const UpsertComponentList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  $$unsubscribe_reportMaker();
  return `${$reportMaker.showComponentList ? `<div class="modal modal-open"><div class="modal-box max-w-xs"><div class="flex justify-between items-center mb-4"><div class="text-xl font-semibold" data-svelte-h="svelte-wsxkrx">Select Component</div> <button>${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      icon: "mdi:close",
      class: "cursor-pointer text-error",
      width: 20
    },
    {},
    {}
  )}</button></div> <div class="flex flex-col gap-4">${each(componentTypesList, ({ labels: { key, Key }, client: { icon } }) => {
    return `<button class="btn rounded-box text-xl justify-start normal-case">${validate_component(Icon, "Icon").$$render($$result, { icon }, {}, {})} ${escape(Key)} </button>`;
  })} <div class="btn rounded-box text-xl justify-start normal-case">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:chart-bar" }, {}, {})} Bar Graph</div> <div class="btn rounded-box text-xl justify-start normal-case">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:chart-pie" }, {}, {})} Pie Chart</div></div></div></div>` : ``}`;
});
const bgColors = [
  { key: "bg-base-100", value: "Base 100" },
  { key: "bg-base-200", value: "Base 200" },
  { key: "bg-base-300", value: "Base 300" },
  { key: "bg-primary", value: "Primary" },
  { key: "bg-secondary", value: "Secondary" },
  { key: "bg-accent", value: "Accent" },
  { key: "bg-neutral", value: "Neutral" },
  { key: "bg-info", value: "Info" },
  { key: "bg-warning", value: "Warning" },
  { key: "bg-success", value: "Success" }
];
const textColors = [
  { key: "text-base-content", value: "Base Content" },
  { key: "text-base-100", value: "Base 100" },
  { key: "text-base-200", value: "Base 200" },
  { key: "text-base-300", value: "Base 300" },
  { key: "text-primary", value: "Primary" },
  { key: "text-secondary", value: "Secondary" },
  { key: "text-accent", value: "Accent" },
  { key: "text-neutral", value: "Neutral" },
  { key: "text-info", value: "Info" },
  { key: "text-warning", value: "Warning" },
  { key: "text-success", value: "Success" }
];
const shadowOptions = [
  { key: "shadow-none", value: "None" },
  { key: "shadow-sm", value: "Small" },
  { key: "shadow", value: "Base" },
  { key: "shadow-md", value: "Medium" },
  { key: "shadow-lg", value: "Large" },
  { key: "shadow-xl", value: "Extra Large" },
  { key: "shadow-2xl", value: "Double Extra Large" },
  { key: "shadow-inner", value: "Inner" }
];
const roundedOptions = [
  { key: "rounded-none", value: "None" },
  { key: "rounded-sm", value: "Small" },
  { key: "rounded", value: "Base" },
  { key: "rounded-md", value: "Medium" },
  { key: "rounded-lg", value: "Large" },
  { key: "rounded-xl", value: "Extra Large" },
  { key: "rounded-2xl", value: "Double Extra Large" }
];
const componentProperties = { bgColors, textColors, shadowOptions, roundedOptions };
const PropertiesForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let upsertReport;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  let { properties } = $$props;
  if ($$props.properties === void 0 && $$bindings.properties && properties !== void 0)
    $$bindings.properties(properties);
  ({ upsertReport } = $reportMaker);
  $$unsubscribe_reportMaker();
  return `<div class="collapse collapse-arrow mt-2"><input type="checkbox" class="peer" ${""}> <div class="collapse-title p-1 flex items-center" data-svelte-h="svelte-15ksxeg"><div class="text-lg font-bold">Properties</div></div> <div class="collapse-content p-0 rounded-lg"><div class="grid grid-cols-2 gap-x-6 gap-y-1"><div class="form-control flex-grow"><div class="label" data-svelte-h="svelte-4eeyg2">Position X</div> <input type="number" placeholder="Type here" class="input input-sm input-bordered"${add_attribute("value", properties.x, 0)}></div> <div class="form-control flex-grow"><div class="label" data-svelte-h="svelte-1o99e2z">Position Y</div> <input type="number" placeholder="Type here" class="input input-sm input-bordered"${add_attribute("value", properties.y, 0)}></div> <div class="form-control flex-grow"><div class="label" data-svelte-h="svelte-16tpmt9">Width</div> <input type="number" placeholder="Type here" class="input input-sm input-bordered"${add_attribute("value", properties.width, 0)}></div> <div class="form-control flex-grow"><div class="label" data-svelte-h="svelte-qulb3i">Height</div> <input type="number" placeholder="Type here" class="input input-sm input-bordered"${add_attribute("value", properties.height, 0)}></div> <div class="form-control flex-grow"><div class="label" data-svelte-h="svelte-a1f64">Padding</div> <input type="number" placeholder="Type here" class="input input-sm input-bordered"${add_attribute("value", properties.padding, 0)}></div> <div class="form-control flex-grow"><div class="label" data-svelte-h="svelte-1y8zwc4">Opacity</div> <input type="range" min="0" max="100" class="range range-primary" style="${"opacity: " + escape(properties.opacity / 100, true)}"${add_attribute("value", properties.opacity, 0)}></div> <div class="form-control flex-grow"><div class="label" data-svelte-h="svelte-1u88172">Background Color</div> <select placeholder="Type here" class="${"select select-sm select-bordered " + escape(properties.bgColor, true) + " " + escape(properties.textColor, true)}"${add_attribute("data-theme", upsertReport.theme, 0)}>${each(componentProperties.bgColors, ({ key, value }) => {
    return `<option${add_attribute("class", key, 0)}${add_attribute("value", key, 0)}>${escape(value)}</option>`;
  })}</select></div> <div class="form-control flex-grow"><div class="label" data-svelte-h="svelte-q30e17">Text Color</div> <select placeholder="Type here" class="${"select select-sm select-bordered " + escape(properties.bgColor, true) + " " + escape(properties.textColor, true)}"${add_attribute("data-theme", upsertReport.theme, 0)}>${each(componentProperties.textColors, ({ key, value }) => {
    return `<option${add_attribute("class", key, 0)}${add_attribute("value", key, 0)}>${escape(value)}</option>`;
  })}</select></div> <div class="form-control flex-grow"><div class="label" data-svelte-h="svelte-h2430v">Shadow</div> <select placeholder="Type here" class="${"select select-sm select-bordered " + escape(properties.shadow, true)}">${each(componentProperties.shadowOptions, ({ key, value }) => {
    return `<option${add_attribute("class", key, 0)}${add_attribute("value", key, 0)}>${escape(value)}</option>`;
  })}</select></div> <div class="form-control flex-grow"><div class="label" data-svelte-h="svelte-quiwb4">Rounded</div> <select placeholder="Type here" class="${"select select-sm select-bordered " + escape(properties.rounded, true)}">${each(componentProperties.roundedOptions, ({ key, value }) => {
    return `<option${add_attribute("class", key, 0)}${add_attribute("value", key, 0)}>${escape(value)}</option>`;
  })}</select></div> <div class="form-control mt-4"><label class="label cursor-pointer"><span data-svelte-h="svelte-1k5s824">Border</span> <input type="checkbox" class="checkbox checkbox-primary"${add_attribute("checked", properties.border, 1)}></label></div> <div class="form-control mt-4"><label class="label cursor-pointer"><span data-svelte-h="svelte-l0gf28">Outline</span> <input type="checkbox" class="checkbox checkbox-primary"${add_attribute("checked", properties.outline, 1)}></label></div></div></div></div>`;
});
const UpsertCardComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let upsertReport;
  let dbData;
  let upsertCardComponent;
  let data;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  let zodErrors;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    ({ upsertReport, dbData, upsertCardComponent } = $reportMaker);
    data = $reportMaker.dbData[$reportMaker.upsertCardComponent?.datasetId ?? ""];
    $$rendered = `${$reportMaker.upsertCardComponent ? `<div class="modal modal-open"><div class="modal-box max-w-xl"><div class="flex justify-between items-center mb-4"><div class="text-xl font-bold" data-svelte-h="svelte-irtjxl">Card Component</div> <button>${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        icon: "mdi:close",
        class: "cursor-pointer text-error",
        width: 20
      },
      {},
      {}
    )}</button></div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-1i5hl0a">Component Name</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.name, true)}"${add_attribute("value", $reportMaker.upsertCardComponent.name, 0)}> ${``}</div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-6vtcli">Dataset</div> <select class="select select-bordered"><option value="" selected disabled data-svelte-h="svelte-179trgp">Select an option</option>${each(Object.keys(dbData), (datasetId) => {
      let datasetName = upsertReport.datasets.find((d) => d.id === datasetId)?.name;
      return ` ${datasetName ? `<option${add_attribute("value", datasetId, 0)}>${escape(datasetName)}</option>` : ``}`;
    })}</select></div> <div class="form-control mb-1"><div class="label font-semibold justify-start" data-svelte-h="svelte-1ojfyx">Label
					<span class="ml-2 font-normal opacity-80">(optional)</span></div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.label, true)}"${add_attribute("value", $reportMaker.upsertCardComponent.label, 0)}> ${``}</div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-1m8wfmb">Column Name</div> <select class="${"select select-bordered " + escape((!data || zodErrors?.column) && "select-error", true)}"><option value="" selected disabled data-svelte-h="svelte-179trgp">Select an option</option>${data ? `${each(Object.keys(data[0]), (column) => {
      return `<option${add_attribute("value", column, 0)}>${escape(column)}</option>`;
    })}` : ``}</select> ${!data ? `<div class="label text-xs text-error" data-svelte-h="svelte-1cgdie3">Select a dataset to get columns</div>` : ``} ${``}</div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-owkb1z">Row Number</div> <input type="number" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.rowNumber, true)}"${add_attribute("value", $reportMaker.upsertCardComponent.rowNumber, 0)}> ${``}</div> ${validate_component(PropertiesForm, "PropertiesForm").$$render(
      $$result,
      {
        properties: $reportMaker.upsertCardComponent.properties
      },
      {
        properties: ($$value) => {
          $reportMaker.upsertCardComponent.properties = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="modal-action mt-6"><button class="btn btn-error w-24" data-svelte-h="svelte-1wwof4v">Cancel</button> <button class="btn btn-success w-24" data-svelte-h="svelte-g6dz03">Submit</button></div></div></div>` : ``}`;
  } while (!$$settled);
  $$unsubscribe_reportMaker();
  return $$rendered;
});
const UpsertTableComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let upsertReport;
  let dbData;
  let upsertTableComponent;
  let data;
  let allColumns;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  let zodErrors;
  let columns = [];
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    ({ upsertReport, dbData, upsertTableComponent } = $reportMaker);
    data = $reportMaker.dbData[$reportMaker.upsertTableComponent?.datasetId ?? ""];
    {
      if (upsertTableComponent)
        columns = upsertTableComponent.columns.split(",");
    }
    allColumns = data && Object.keys(data[0]).join() === columns.join();
    $$rendered = `${$reportMaker.upsertTableComponent ? `<div class="modal modal-open"><div class="modal-box max-w-xl"><div class="flex justify-between items-center mb-4"><div class="text-xl font-bold" data-svelte-h="svelte-1wntjin">Table Component</div> <button>${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        icon: "mdi:close",
        class: "cursor-pointer text-error",
        width: 20
      },
      {},
      {}
    )}</button></div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-1i5hl0a">Component Name</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.name, true)}"${add_attribute("value", $reportMaker.upsertTableComponent.name, 0)}> ${``}</div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-6vtcli">Dataset</div> <select class="select select-bordered"><option value="" selected disabled data-svelte-h="svelte-179trgp">Select an option</option>${each(Object.keys(dbData), (datasetId) => {
      let datasetName = upsertReport.datasets.find((d) => d.id === datasetId)?.name;
      return ` <option${add_attribute("value", datasetId, 0)}>${escape(datasetName)}</option>`;
    })}</select></div> <div class="form-control mb-1"><div class="label font-semibold justify-start" data-svelte-h="svelte-1ojfyx">Label
					<span class="ml-2 font-normal opacity-80">(optional)</span></div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.label, true)}"${add_attribute("value", $reportMaker.upsertTableComponent.label, 0)}> ${``}</div> <div class="form-control mb-1 mt-2"><div class="label"><div class="font-semibold" data-svelte-h="svelte-1rxnl8t">Column Name</div> <button class="${"btn btn-xs btn-outline " + escape(allColumns ? "btn-error" : "btn-primary", true)}">${escape(allColumns ? "Remove all columns" : "Select all columns")}</button></div> <select class="${"select select-bordered h-80 " + escape((!data || zodErrors?.columns) && "select-error", true)}" multiple>${data ? `${each(Object.keys(data[0]), (column) => {
      return `<option${add_attribute("value", column, 0)}>${escape(column)}</option>`;
    })}` : ``}</select> ${!data ? `<div class="label text-xs text-error" data-svelte-h="svelte-1cgdie3">Select a dataset to get columns</div>` : ``} ${``}</div> <div class="form-control mb-1"><div class="label font-semibold justify-start" data-svelte-h="svelte-1xqrkbu">Row Range
					<span class="ml-2 font-normal opacity-80">(optional)</span></div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.rows, true)}"${add_attribute("value", $reportMaker.upsertTableComponent.rows, 0)}> ${``} <span class="label text-xs" data-svelte-h="svelte-1usgk85">Enter a specific range in this format 1-100, or leave it empty to select all rows.</span></div> <div class="text-lg font-bold mb-2" data-svelte-h="svelte-6rtbiv">Table Options:</div> <div class="grid grid-cols-2 gap-x-6 gap-y-1"><div class="form-control"><label class="label cursor-pointer"><span class="label-text" data-svelte-h="svelte-1izh3b7">Searching</span> <input type="checkbox" class="toggle toggle-primary"${add_attribute("checked", $reportMaker.upsertTableComponent.searching, 1)}></label></div> <div class="form-control"><label class="label cursor-pointer"><span class="label-text" data-svelte-h="svelte-1orqxhr">Ordering</span> <input type="checkbox" class="toggle toggle-primary"${add_attribute("checked", $reportMaker.upsertTableComponent.ordering, 1)}></label></div> <div class="form-control"><label class="label cursor-pointer"><span class="label-text" data-svelte-h="svelte-1rek9ab">Paging</span> <input type="checkbox" class="toggle toggle-primary"${add_attribute("checked", $reportMaker.upsertTableComponent.paging, 1)}></label></div> <div class="form-control"><label class="label cursor-pointer"><span class="label-text" data-svelte-h="svelte-jks2fv">Info</span> <input type="checkbox" class="toggle toggle-primary"${add_attribute("checked", $reportMaker.upsertTableComponent.info, 1)}></label></div></div> ${validate_component(PropertiesForm, "PropertiesForm").$$render(
      $$result,
      {
        properties: $reportMaker.upsertTableComponent.properties
      },
      {
        properties: ($$value) => {
          $reportMaker.upsertTableComponent.properties = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="modal-action mt-6"><button class="btn btn-error w-24" data-svelte-h="svelte-1wwof4v">Cancel</button> <button class="btn btn-success w-24" data-svelte-h="svelte-g6dz03">Submit</button></div></div></div>` : ``}`;
  } while (!$$settled);
  $$unsubscribe_reportMaker();
  return $$rendered;
});
const inputComponentTypes = {
  text: "Text",
  number: "Number",
  email: "Email",
  password: "Password",
  date: "Date",
  time: "Time",
  textarea: "Textarea",
  select: "Select",
  checkbox: "Checkbox",
  toggle: "Toggle"
};
const UpsertInputComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let upsertReport;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  let zodErrors;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($reportMaker.upsertInputComponent)
        if (["select", "checkbox", "toggle"].includes($reportMaker.upsertInputComponent.type)) {
          if ($reportMaker.upsertInputComponent.valueType === void 0) {
            set_store_value(reportMaker, $reportMaker.upsertInputComponent.valueType = "values", $reportMaker);
            set_store_value(reportMaker, $reportMaker.upsertInputComponent.values = "", $reportMaker);
          }
        } else {
          set_store_value(reportMaker, $reportMaker.upsertInputComponent.valueType = void 0, $reportMaker);
          set_store_value(reportMaker, $reportMaker.upsertInputComponent.values = void 0, $reportMaker);
        }
    }
    ({ upsertReport } = $reportMaker);
    $$rendered = `${$reportMaker.upsertInputComponent ? (() => {
      let { valueType } = $reportMaker.upsertInputComponent;
      return ` <div class="modal modal-open"><div class="modal-box max-w-xl"><div class="flex justify-between items-center mb-4"><div class="text-xl font-bold" data-svelte-h="svelte-narjw7">Input Component</div> <button>${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "mdi:close",
          class: "cursor-pointer text-error",
          width: 20
        },
        {},
        {}
      )}</button></div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-1i5hl0a">Component Name</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.name, true)}"${add_attribute("value", $reportMaker.upsertInputComponent.name, 0)}> ${``}</div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-3w0v9f">Query Param</div> <select class="select select-bordered"><option value="" selected disabled data-svelte-h="svelte-179trgp">Select an option</option>${each(upsertReport.datasets, ({ name, queryParams }) => {
        return `${each(queryParams, ({ id, key }) => {
          return `<option${add_attribute("value", id, 0)}>${escape(name)} - ${escape(key)}</option>`;
        })}`;
      })}</select> ${``}</div> <div class="form-control mb-1"><div class="label font-semibold justify-start" data-svelte-h="svelte-1ojfyx">Label
					<span class="ml-2 font-normal opacity-80">(optional)</span></div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.label, true)}"${add_attribute("value", $reportMaker.upsertInputComponent.label, 0)}> ${``}</div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-m3qym4">Input Type</div> <select class="select select-bordered">${each(Object.entries(inputComponentTypes), ([key, value]) => {
        return `<option${add_attribute("value", key, 0)}>${escape(value)}</option>`;
      })}</select> ${``}</div> ${valueType ? `<div class="tabs mt-8 mb-4"><button class="${"tab tab-bordered w-1/2 text-lg font-semibold " + escape(valueType === "values" && "tab-active", true)}">Values</button> <button class="${"tab tab-bordered w-1/2 text-lg font-semibold " + escape(valueType === "query" && "tab-active", true)}">Query</button></div> ${valueType === "values" ? `<div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-sydcga">Values</div> <textarea placeholder="Type here" class="${"textarea textarea-bordered " + escape(zodErrors?.values, true)}">${escape($reportMaker.upsertInputComponent.values || "")}</textarea> <div class="label text-xs">Enter values as comma separated
							${["checkbox", "toggle"].includes($reportMaker.upsertInputComponent.type) ? `(first value will be used as true value and second value will be used as false value)` : ``}</div> ${``}</div>` : `${valueType === "query" ? `<div class="form-control"><div class="label font-semibold" data-svelte-h="svelte-1cbsv9a">Query</div> <textarea placeholder="Type here" class="${"textarea textarea-bordered " + escape(zodErrors?.values, true)}">${escape($reportMaker.upsertInputComponent.values || "")}</textarea> <div class="label text-xs">Enter SQL query to fetch values (Takes the values of the first column
							${["checkbox", "toggle"].includes($reportMaker.upsertInputComponent.type) ? `and first value will be used as true value and second value will be used as false value)` : ``}
							)</div> ${``}</div>` : ``}`}` : ``} ${validate_component(PropertiesForm, "PropertiesForm").$$render(
        $$result,
        {
          properties: $reportMaker.upsertInputComponent.properties
        },
        {
          properties: ($$value) => {
            $reportMaker.upsertInputComponent.properties = $$value;
            $$settled = false;
          }
        },
        {}
      )} <div class="modal-action mt-6"><button class="btn btn-error w-24" data-svelte-h="svelte-1wwof4v">Cancel</button> <button class="btn btn-success w-24" data-svelte-h="svelte-g6dz03">Submit</button></div></div></div>`;
    })() : ``}`;
  } while (!$$settled);
  $$unsubscribe_reportMaker();
  return $$rendered;
});
const buttonComponentTypes = {
  fetch: "Fetch",
  fetchAll: "Fetch All"
};
const UpsertButtonComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let upsertReport;
  let dbData;
  let upsertButtonComponent;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  let zodErrors;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    ({ upsertReport, dbData, upsertButtonComponent } = $reportMaker);
    $$rendered = `${$reportMaker.upsertButtonComponent ? `<div class="modal modal-open"><div class="modal-box max-w-xl"><div class="flex justify-between items-center mb-4"><div class="text-xl font-bold" data-svelte-h="svelte-qfg62v">Button Component</div> <button>${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        icon: "mdi:close",
        class: "cursor-pointer text-error",
        width: 20
      },
      {},
      {}
    )}</button></div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-1i5hl0a">Component Name</div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.name, true)}"${add_attribute("value", $reportMaker.upsertButtonComponent.name, 0)}> ${``}</div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-6vtcli">Dataset</div> <select class="select select-bordered"><option value="" selected disabled data-svelte-h="svelte-179trgp">Select an option</option>${each(Object.keys(dbData), (datasetId) => {
      let datasetName = upsertReport.datasets.find((d) => d.id === datasetId)?.name;
      return ` ${datasetName ? `<option${add_attribute("value", datasetId, 0)}>${escape(datasetName)}</option>` : ``}`;
    })}</select></div> <div class="form-control mb-1"><div class="label font-semibold" data-svelte-h="svelte-jraufc">Type</div> <select class="select select-bordered"><option value="" selected disabled data-svelte-h="svelte-179trgp">Select an option</option>${each(Object.entries(buttonComponentTypes), ([key, value]) => {
      return `<option${add_attribute("value", key, 0)}>${escape(value)}</option>`;
    })}</select></div> <div class="form-control mb-1"><div class="label font-semibold justify-start" data-svelte-h="svelte-10x7gje">Text
					<span class="ml-2 font-normal opacity-80">(optional)</span></div> <input type="text" placeholder="Type here" class="${"input input-bordered " + escape(zodErrors?.text, true)}"${add_attribute("value", $reportMaker.upsertButtonComponent.text, 0)}> ${``}</div> ${validate_component(PropertiesForm, "PropertiesForm").$$render(
      $$result,
      {
        properties: $reportMaker.upsertButtonComponent.properties
      },
      {
        properties: ($$value) => {
          $reportMaker.upsertButtonComponent.properties = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="modal-action mt-6"><button class="btn btn-error w-24" data-svelte-h="svelte-1wwof4v">Cancel</button> <button class="btn btn-success w-24" data-svelte-h="svelte-g6dz03">Submit</button></div></div></div>` : ``}`;
  } while (!$$settled);
  $$unsubscribe_reportMaker();
  return $$rendered;
});
const Components = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tableValues;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  tableValues = componentTypesList.flatMap(({ labels: { key, keyComponents }, client: { getTableValues } }) => $reportMaker.upsertReport[keyComponents].flatMap((component) => ({
    key,
    values: getTableValues(component),
    editFn: () => {
      switch (key) {
        case "input":
          set_store_value(reportMaker, $reportMaker.upsertInputComponent = cloneDeep(component), $reportMaker);
          break;
        case "button":
          set_store_value(reportMaker, $reportMaker.upsertButtonComponent = cloneDeep(component), $reportMaker);
          break;
        case "card":
          set_store_value(reportMaker, $reportMaker.upsertCardComponent = cloneDeep(component), $reportMaker);
          break;
        case "table":
          set_store_value(reportMaker, $reportMaker.upsertTableComponent = cloneDeep(component), $reportMaker);
          break;
      }
    },
    deleteFn: () => reportMaker.deleteComponent(key, component.id)
  })));
  $$unsubscribe_reportMaker();
  return `<div class="collapse collapse-arrow"><input type="checkbox" class="peer" ${"checked"}> <div class="collapse-title"><div class="flex items-center gap-2 text-lg font-semibold">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:view-dashboard-outline" }, {}, {})}
			Components: <span class="font-mono">(${escape(tableValues.length)})</span> <button class="z-10 text-success">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:add-circle", width: 24 }, {}, {})}</button></div></div> <div class="collapse-content"><div class="overflow-x-auto rounded-lg shadow-sm px-1 mt-2"><table class="table"><thead class="bg-base-200" data-svelte-h="svelte-fmfix1"><tr><th></th> <th>Name</th> <th>Component Type</th> <th>Datasets</th> <th>Values</th> <th></th></tr></thead> <tbody>${each(tableValues, ({ values: { key, name, datasetId, values }, editFn, deleteFn }) => {
    let datasetName = $reportMaker.upsertReport.datasets.find((d) => d.id === datasetId)?.name;
    return ` <tr class="hover"><td><button>${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        icon: "mdi:square-edit-outline",
        width: 22,
        class: "text-info"
      },
      {},
      {}
    )} </button></td> <td class="font-semibold">${escape(name)}</td> <td>${escape(key[0].toUpperCase() + key.slice(1))}</td> <td>${escape(datasetName ?? "N/A")}</td> <td class="space-x-4">${each(Object.entries(values), ([key2, value]) => {
      return `<span><span class="font-semibold">${escape(key2)}:</span> ${escape(value)} </span>`;
    })}</td> <td class="w-1"><button>${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        icon: "mdi:delete-forever",
        width: 22,
        class: "text-error"
      },
      {},
      {}
    )} </button></td> </tr>`;
  })}</tbody></table></div></div></div> ${validate_component(UpsertComponentList, "ComponentList").$$render($$result, {}, {}, {})} ${validate_component(UpsertInputComponent, "UpsertInputComponent").$$render($$result, {}, {}, {})} ${validate_component(UpsertButtonComponent, "UpsertButtonComponent").$$render($$result, {}, {}, {})} ${validate_component(UpsertCardComponent, "UpsertCardComponent").$$render($$result, {}, {}, {})} ${validate_component(UpsertTableComponent, "UpsertTableComponent").$$render($$result, {}, {}, {})}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  let { data } = $$props;
  let { apiKey, report, theme } = data;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_reportMaker();
  return `${$reportMaker.init ? `<div class="px-8"><div class="flex items-center mb-8"><div class="w-full"><a href="/" class="btn btn-ghost">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:chevron-left", width: 22 }, {}, {})} Reports</a></div> <div class="text-2xl font-semibold whitespace-nowrap" data-svelte-h="svelte-1ehlas3">Report Maker</div>  <div class="w-full flex justify-end"><div class="dropdown dropdown-end dropdown-hover"><div${add_attribute("tabindex", 0, 0)} class="btn btn-ghost btn-circle avatar p-1 items-center">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:dots-vertical", width: 28 }, {}, {})}</div> <ul${add_attribute("tabindex", 0, 0)} class="dropdown-content z-[50] menu gap-y-1 shadow bg-base-200 rounded-box w-60 p-3"><li><a href="${"/view-report?id=" + escape(report?.id, true) + "&apiKey=" + escape(apiKey, true)}" target="_blank" class="text-base font-bold py-4">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:open-in-new", width: 22 }, {}, {})}
								View Report</a></li> <li><button class="text-base font-bold py-4">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:eye-off", width: 22 }, {}, {})}
								Hide UI
								${``}</button></li> <li><button class="text-base font-bold py-4 text-success hover:text-success hover:bg-success-content">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:content-save", width: 22 }, {}, {})}
								Save Report</button></li> <li><div class="text-base font-bold py-4 text-error hover:text-error hover:bg-error-content">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:delete-forever", width: 22 }, {}, {})}
								Delete Report</div></li></ul></div></div></div> ${`<div class="border shadow rounded-box py-2">${validate_component(ReportForm, "ReportForm").$$render($$result, {}, {}, {})} <div class="divider m-0"></div> ${validate_component(Datasets, "Datasets").$$render($$result, {}, {}, {})} <div class="divider m-0"></div> ${validate_component(Components, "Components").$$render($$result, {}, {}, {})}</div>`} ${validate_component(ReportCanvas, "ReportCanvas").$$render($$result, {}, {}, {})}</div>` : ``}`;
});
export {
  Page as default
};
