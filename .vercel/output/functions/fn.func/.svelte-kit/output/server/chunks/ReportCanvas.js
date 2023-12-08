import { g as get_store_value, s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as add_attribute, e as escape, b as each, v as validate_component } from "./ssr.js";
import { w as writable } from "./index2.js";
import { a as trpcClientErrorHandler } from "./trpcErrorhandler.js";
import { createTRPCClient } from "trpc-sveltekit";
import { u as ui } from "./ui.store.js";
import { p as page } from "./stores.js";
import { nanoid } from "nanoid";
import cloneDeep from "lodash.clonedeep";
import { c as componentTypesList, a as componentTypes, g as getComponentClass } from "./componentTypes.js";
import jq from "jquery";
import "datatables.net-dt";
function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate" || key === "on_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const invalidateAll = /* @__PURE__ */ client_method("invalidate_all");
let browserClient;
function trpc(init) {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser && browserClient)
    return browserClient;
  const client = createTRPCClient({ init });
  if (isBrowser)
    browserClient = client;
  return client;
}
const getQueryParams = (query) => [
  ...new Set(query.match(/\${(.*?)}/g)?.map((match) => match.slice(2, -1)))
];
const replaceQueryParams = (query, queryParams, highlight = false) => query.replace(/\${(.*?)}/g, (_, key) => {
  const value = queryParams.find((param) => param.key === key)?.value ?? "";
  return highlight ? `<span class="text-secondary font-semibold">${value}</span>` : value;
});
const reportMaker = (() => {
  const newReport = (() => {
    const components = Object.fromEntries(componentTypesList.map((ct) => [ct.labels.keyComponents, []]));
    return {
      id: nanoid(),
      name: "",
      description: "",
      theme: "",
      canvasHeight: 500,
      datasets: [],
      ...components
    };
  })();
  const { subscribe: subscribe2, set, update } = writable({
    init: false,
    upsertReport: cloneDeep(newReport),
    showSelectTheme: false,
    dbData: {},
    showComponentList: false
  });
  const init = async (report, theme) => {
    update((state) => ({
      ...state,
      init: true,
      upsertReport: report ?? { ...newReport, theme },
      zodErrors: void 0
    }));
    await fetchAllDatasets();
  };
  const saveReport = async () => {
    const $page = get_store_value(page);
    const { upsertReport } = get_store_value(reportMaker);
    ui.setLoader({ title: "Saving Report" });
    await trpc($page).report.save.query(upsertReport).catch(
      (e) => trpcClientErrorHandler(e, (e2) => update((state) => ({ ...state, zodErrors: e2.zodErrors })))
    );
    ui.showToast({
      class: "alert-success",
      title: "Report Updated Successfully"
    });
    invalidateAll();
    ui.setLoader();
  };
  const showAddDatasetModal = () => update((state) => ({
    ...state,
    upsertDataset: {
      id: nanoid(),
      databaseId: void 0,
      name: "",
      query: "",
      queryParams: []
    }
  }));
  const watchQueryParams = (query) => {
    const { upsertDataset } = get_store_value(reportMaker);
    if (!upsertDataset)
      return;
    const queryParams = getQueryParams(query).map((key) => {
      const queryParam = upsertDataset.queryParams.find((qp) => qp.key === key);
      return queryParam ?? {
        id: nanoid(),
        key,
        value: ""
      };
    });
    update((state) => ({ ...state, upsertDataset: { ...upsertDataset, queryParams } }));
  };
  const submitDataset = () => {
    const {
      upsertReport: { datasets },
      upsertDataset
    } = get_store_value(reportMaker);
    if (!upsertDataset)
      return;
    const i = datasets.findIndex((c) => c.id === upsertDataset.id);
    if (i < 0)
      datasets.push(upsertDataset);
    else
      datasets[i] = upsertDataset;
    update((state) => ({
      ...state,
      upsertReport: { ...state.upsertReport, datasets },
      upsertDataset: void 0
    }));
  };
  const fetchAllDatasets = async () => {
    const datasets = get_store_value(reportMaker).upsertReport.datasets;
    for (const { id } of datasets)
      await fetchDataset(id);
  };
  const fetchDataset = async (id) => {
    const $page = get_store_value(page);
    const dataset = get_store_value(reportMaker).upsertReport.datasets.find((d) => d.id === id);
    if (!dataset)
      return;
    ui.setLoader({ title: `Fetching Dataset: ${dataset?.name}` });
    const { databaseId, query, queryParams } = dataset;
    if (!databaseId)
      return ui.showToast({ class: "alert-error", title: "Database not found" });
    const resultQuery = replaceQueryParams(query, queryParams);
    const { data } = await trpc($page).database.queryData.query({ id: databaseId, query: resultQuery }).catch(
      (e) => trpcClientErrorHandler(e, () => update((state) => ({ ...state, dbData: { ...state.dbData, [id]: void 0 } })))
    );
    update((state) => ({ ...state, dbData: { ...state.dbData, [id]: data } }));
    ui.setLoader();
  };
  const deleteDataset = (id) => update((state) => ({
    ...state,
    upsertReport: {
      ...state.upsertReport,
      datasets: state.upsertReport.datasets.filter((d) => d.id !== id)
    },
    dbData: { ...state.dbData, [id]: void 0 }
  }));
  const showAddComponentModal = (type) => update((state) => ({
    ...state,
    showComponentList: false,
    [componentTypes[type].labels.upsertKeyComponent]: componentTypes[type].client.newComponent
  }));
  const submitComponent = (type) => update((state) => {
    const {
      labels: { keyComponents, upsertKeyComponent }
    } = componentTypes[type];
    const components = state.upsertReport[keyComponents];
    const upsertComponent = state[upsertKeyComponent];
    if (!upsertComponent)
      return state;
    const i = components.findIndex((c) => c.id === upsertComponent?.id);
    if (i < 0)
      components[components.length] = upsertComponent;
    else
      components[i] = upsertComponent;
    return {
      ...state,
      upsertReport: { ...state.upsertReport, [keyComponents]: components },
      [upsertKeyComponent]: void 0
    };
  });
  const deleteComponent = (type, id) => update((state) => ({
    ...state,
    upsertReport: {
      ...state.upsertReport,
      [`${type}Components`]: state.upsertReport[`${type}Components`].filter((c) => c.id !== id)
    }
  }));
  return {
    subscribe: subscribe2,
    set,
    update,
    init,
    saveReport,
    showAddDatasetModal,
    watchQueryParams,
    submitDataset,
    fetchAllDatasets,
    fetchDataset,
    deleteDataset,
    showAddComponentModal,
    deleteComponent,
    submitComponent
  };
})();
const CardComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let id;
  let datasetId;
  let label;
  let column;
  let rowNumber;
  let properties;
  let cardComponents;
  let dbData;
  let data;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  let { view = false } = $$props;
  let { cardComponent } = $$props;
  let element;
  if ($$props.view === void 0 && $$bindings.view && view !== void 0)
    $$bindings.view(view);
  if ($$props.cardComponent === void 0 && $$bindings.cardComponent && cardComponent !== void 0)
    $$bindings.cardComponent(cardComponent);
  ({ id, datasetId, label, column, rowNumber, properties } = cardComponent);
  ({ upsertReport: { cardComponents }, dbData } = $reportMaker);
  data = dbData[datasetId ?? ""]?.[rowNumber - 1][column];
  $$unsubscribe_reportMaker();
  return ` <div${add_attribute("id", id, 0)}${add_attribute("class", getComponentClass(view, properties), 0)}${add_attribute("this", element, 0)}><div class="text-lg font-semibold">${escape(label)}</div> <div>${escape(data)}</div></div>`;
});
const TableComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let id;
  let datasetId;
  let label;
  let columns;
  let rows;
  let searching;
  let ordering;
  let paging;
  let info;
  let properties;
  let tableComponents;
  let dbData;
  let data;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  let { view = false } = $$props;
  let { tableComponent } = $$props;
  let element;
  if ($$props.view === void 0 && $$bindings.view && view !== void 0)
    $$bindings.view(view);
  if ($$props.tableComponent === void 0 && $$bindings.tableComponent && tableComponent !== void 0)
    $$bindings.tableComponent(tableComponent);
  ({ id, datasetId, label, columns, rows, searching, ordering, paging, info, properties } = tableComponent);
  ({ upsertReport: { tableComponents }, dbData } = $reportMaker);
  data = (() => {
    let data2 = dbData[datasetId ?? ""];
    if (rows !== "") {
      const [rowStart, rowEnd] = rows.split("-").map(Number);
      data2 = data2?.slice(rowStart - 1, rowEnd);
    }
    data2 = data2?.map((obj) => columns.split(",").reduce(
      (filteredObj, key) => {
        filteredObj[key] = obj[key];
        return filteredObj;
      },
      {}
    ));
    return data2;
  })();
  {
    ((data2) => data2 && jq(`#${id}_table`).DataTable().destroy())(data);
  }
  $$unsubscribe_reportMaker();
  return ` <div${add_attribute("id", id, 0)}${add_attribute("class", getComponentClass(view, properties), 0)}${add_attribute("this", element, 0)}><div class="text-lg font-semibold mb-2">${escape(label)}</div> <div class="overflow-x-auto w-full">${data && data.length > 0 ? `<table id="${escape(id, true) + "_table"}" class="table table-zebra table-xs"><thead class="bg-base-200"><tr>${each(Object.keys(data[0]), (key) => {
    return `<th>${escape(key)}</th>`;
  })}</tr></thead> <tbody>${each(data, (row) => {
    return `<tr class="hover">${each(Object.values(row), (value) => {
      return `<td>${escape(value)}</td>`;
    })} </tr>`;
  })}</tbody></table>` : ``}</div></div>`;
});
const InputComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let id;
  let queryParamId;
  let label;
  let type;
  let valueType;
  let values;
  let properties;
  let datasets;
  let inputComponents;
  let datasetI;
  let qpI;
  let $reportMaker, $$unsubscribe_reportMaker;
  let $page, $$unsubscribe_page;
  let $ui, $$unsubscribe_ui;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_ui = subscribe(ui, (value) => $ui = value);
  let { view = false } = $$props;
  let { inputComponent } = $$props;
  let options = [];
  const getOptions = async (valueType2, values2) => {
    if (qpI >= 0)
      if (valueType2 === "values")
        options = values2.split("|").map((v) => ({
          value: v.split(",")[0],
          text: v.split(",")[1]
        }));
      else {
        if ($ui.loader === void 0)
          ui.setLoader({ title: "Loading options" });
        const optionData = await trpc($page).database.queryData.query({
          id: datasets[datasetI].databaseId ?? "",
          query: values2
        });
        options = optionData.data.map((d) => ({
          value: String(d.value),
          text: String(d.text)
        }));
        ui.setLoader();
      }
  };
  let element;
  if ($$props.view === void 0 && $$bindings.view && view !== void 0)
    $$bindings.view(view);
  if ($$props.inputComponent === void 0 && $$bindings.inputComponent && inputComponent !== void 0)
    $$bindings.inputComponent(inputComponent);
  ({ id, queryParamId, label, type, valueType, values, properties } = inputComponent);
  ({ upsertReport: { datasets, inputComponents } } = $reportMaker);
  datasetI = datasets.findIndex((d) => d.queryParams.find((qp) => qp.id === queryParamId));
  qpI = datasetI >= 0 ? datasets[datasetI].queryParams.findIndex((qp) => qp.id === queryParamId) : -1;
  valueType && values && getOptions(valueType, values);
  $$unsubscribe_reportMaker();
  $$unsubscribe_page();
  $$unsubscribe_ui();
  return ` ${qpI >= 0 ? `<div${add_attribute("id", id, 0)}${add_attribute("class", getComponentClass(view, properties), 0)}${add_attribute("this", element, 0)}>${type === "text" ? `<div class="form-control w-full"><div class="label font-semibold">${escape(label)}</div> <input type="text" placeholder="Type here" class="input input-bordered"${add_attribute("value", $reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value, 0)}></div>` : `${type === "number" ? `<div class="form-control w-full"><div class="label font-semibold">${escape(label)}</div> <input type="number" placeholder="Type here" class="input input-bordered"${add_attribute("value", $reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value, 0)}></div>` : `${type === "email" ? `<div class="form-control w-full"><div class="label font-semibold">${escape(label)}</div> <input type="email" placeholder="Type here" class="input input-bordered"${add_attribute("value", $reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value, 0)}></div>` : `${type === "password" ? `<div class="form-control w-full"><div class="label font-semibold">${escape(label)}</div> <input type="password" placeholder="Type here" class="input input-bordered"${add_attribute("value", $reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value, 0)}></div>` : `${type === "date" ? `<div class="form-control w-full"><div class="label font-semibold">${escape(label)}</div> <input type="date" placeholder="Type here" class="input input-bordered"${add_attribute("value", $reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value, 0)}></div>` : `${type === "time" ? `<div class="form-control w-full"><div class="label font-semibold">${escape(label)}</div> <input type="time" placeholder="Type here" class="input input-bordered"${add_attribute("value", $reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value, 0)}></div>` : `${type === "textarea" ? `<div class="form-control w-full"><div class="label font-semibold">${escape(label)}</div> <textarea placeholder="Type here" class="textarea textarea-bordered">${escape($reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value || "")}</textarea></div>` : `${type === "select" ? `<div class="form-control w-full"><div class="label font-semibold">${escape(label)}</div> <select placeholder="Type here" class="select select-bordered">${each(options, ({ value, text }) => {
    return `}
						<option${add_attribute("value", value, 0)}>${escape(text)}</option>`;
  })}</select></div>` : `${type === "checkbox" ? ` <div class="form-control"><button class="label cursor-pointer gap-4"><span>${escape(label)}</span> <input type="checkbox" class="checkbox" ${$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value === "true" ? "checked" : ""}></button></div>` : `${type === "toggle" ? `<div class="form-control"><button class="label cursor-pointer gap-4"><span>${escape(label)}</span> <input type="checkbox" class="toggle" ${$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value === "true" ? "checked" : ""}></button></div>` : ``}`}`}`}`}`}`}`}`}`}</div>` : ``}`;
});
const ButtonComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let id;
  let datasetId;
  let type;
  let text;
  let properties;
  let $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => value);
  let { view = false } = $$props;
  let { buttonComponent } = $$props;
  let element;
  if ($$props.view === void 0 && $$bindings.view && view !== void 0)
    $$bindings.view(view);
  if ($$props.buttonComponent === void 0 && $$bindings.buttonComponent && buttonComponent !== void 0)
    $$bindings.buttonComponent(buttonComponent);
  ({ id, datasetId, type, text, properties } = buttonComponent);
  $$unsubscribe_reportMaker();
  return ` <div${add_attribute("id", id, 0)}${add_attribute("class", getComponentClass(view, properties), 0)}${add_attribute("this", element, 0)}><button class="btn">${escape(text)}</button></div>`;
});
const ReportCanvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let theme;
  let canvasHeight;
  let inputComponents;
  let buttonComponents;
  let cardComponents;
  let tableComponents;
  let $reportMaker, $$unsubscribe_reportMaker;
  $$unsubscribe_reportMaker = subscribe(reportMaker, (value) => $reportMaker = value);
  let { view = false } = $$props;
  let canvasElement;
  if ($$props.view === void 0 && $$bindings.view && view !== void 0)
    $$bindings.view(view);
  ({ upsertReport: { theme, canvasHeight, inputComponents, buttonComponents, cardComponents, tableComponents } } = $reportMaker);
  {
    if (!view && canvasElement)
      canvasElement.style.height = `${canvasHeight}px`;
  }
  $$unsubscribe_reportMaker();
  return `<div id="reportCanvas"${add_attribute(
    "class",
    view ? "" : "border shadow rounded-lg w-[1000px] mt-8 mb-20 mx-auto",
    0
  )}${add_attribute("data-theme", theme, 0)}${add_attribute("this", canvasElement, 0)}>${each(inputComponents, (inputComponent) => {
    return `${validate_component(InputComponent, "InputComponent").$$render($$result, { inputComponent, view }, {}, {})}`;
  })} ${each(buttonComponents, (buttonComponent) => {
    return `${validate_component(ButtonComponent, "ButtonComponent").$$render($$result, { buttonComponent, view }, {}, {})}`;
  })} ${each(cardComponents, (cardComponent) => {
    return `${validate_component(CardComponent, "CardComponent").$$render($$result, { cardComponent, view }, {}, {})}`;
  })} ${each(tableComponents, (tableComponent) => {
    return `${validate_component(TableComponent, "TableComponent").$$render($$result, { tableComponent, view }, {}, {})}`;
  })}</div>`;
});
export {
  ReportCanvas as R,
  replaceQueryParams as a,
  reportMaker as r
};
