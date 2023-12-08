import { c as create_ssr_component, v as validate_component, e as escape, b as each, a as add_attribute } from "../../chunks/ssr.js";
import { I as Icon } from "../../chunks/Icon.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let reports;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  ({ reports } = data);
  return `<div class="container mx-auto"><div class="flex justify-between items-center mt-4 mb-10"><div class="flex gap-2 items-center text-xl font-semibold">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      icon: "mdi:report-box-outline",
      width: 24
    },
    {},
    {}
  )}
			Reports: <span class="font-mono">(${escape(reports.length)})</span></div> <a href="/report-maker" class="btn btn-success">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      icon: "mdi:report-box-plus-outline",
      width: 22
    },
    {},
    {}
  )} Create New Report</a></div> <div class="flex flex-wrap justify-start gap-10">${each(reports, ({ id, name, description, theme, _count: { datasets, cardComponents, tableComponents } }) => {
    let totalComponents = cardComponents + tableComponents;
    return ` <a href="${"/report-maker?id=" + escape(id, true)}"><div class="border shadow rounded-box w-96 cursor-pointer flex flex-col h-full"${add_attribute("data-theme", theme, 0)}><div class="p-4"><div class="flex justify-between items-center mb-2"><div class="text-lg font-bold">${escape(name)}</div> <div class="capitalize">Theme: <span class="text-primary">${escape(theme)}</span></div></div> <div class="break-all mb-2"><span class="font-semibold" data-svelte-h="svelte-zdiezc">Description:</span> ${escape(description)} </div></div> <div class="mt-auto border rounded-b-box flex"><div class="border-r w-full p-2 text-center">Datasets: ${escape(datasets)}</div> <div class="w-full p-2 text-center">Components: ${escape(totalComponents)}</div> </div></div> </a>`;
  })}</div></div>`;
});
export {
  Page as default
};
