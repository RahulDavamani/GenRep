import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import { R as ReportCanvas } from "../../../chunks/ReportCanvas.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(ReportCanvas, "ReportCanvas").$$render($$result, { view: true }, {}, {})}`;
});
export {
  Page as default
};
