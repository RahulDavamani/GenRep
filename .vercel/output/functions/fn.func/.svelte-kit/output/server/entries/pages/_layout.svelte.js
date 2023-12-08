import { s as subscribe } from "../../chunks/utils.js";
import { c as create_ssr_component, e as escape, v as validate_component, a as add_attribute, b as each } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import { I as Icon } from "../../chunks/Icon.js";
import { u as ui } from "../../chunks/ui.store.js";
import { a as appUrls } from "../../chunks/appUrls.js";
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let session;
  let urlPath;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  ({ session } = $page.data);
  urlPath = $page.url.pathname;
  $$unsubscribe_page();
  return `<div class="navbar shadow px-4 flex justify-between"><a href="/" class="text-xl font-bold" data-svelte-h="svelte-gwfi34">GenRep</a> <div class="flex gap-4"><a href="/settings" class="${"btn btn-link " + escape(urlPath !== "/settings" && "no-underline text-base-content", true)}">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      icon: "material-symbols:settings-rounded",
      width: 24
    },
    {},
    {}
  )}</a>  <div class="dropdown dropdown-end"><div${add_attribute("tabindex", 0, 0)} class="btn btn-ghost btn-circle avatar p-1"><img${add_attribute("src", session?.user_picture, 0)} alt="DP" class="rounded-full"></div> <div${add_attribute("tabindex", 0, 0)} class="dropdown-content mt-4 z-[50] bg-base-100 border shadow rounded-box w-64"><div class="p-5 pb-2"><div class="font-semibold">${escape(session?.user.name)}</div> <div class="italic">${escape(session?.user.email)}</div></div> <div class="divider px-4 m-0"></div> <ul class="menu"><li><a href="/settings">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      icon: "material-symbols:settings-rounded",
      width: 20
    },
    {},
    {}
  )} Settings</a></li> <li><button>${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      icon: "material-symbols:logout-rounded",
      width: 20
    },
    {},
    {}
  )} Logout</button></li></ul></div></div></div></div>`;
});
const Toast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $ui, $$unsubscribe_ui;
  $$unsubscribe_ui = subscribe(ui, (value) => $ui = value);
  $$unsubscribe_ui();
  return `${$ui.toast ? (() => {
    let { title } = $ui.toast;
    return ` <div class="toast toast-bottom toast-end z-50 p-2"><div class="${"alert " + escape($ui.toast.class, true) + " border p-3 pl-6 max-w-lg whitespace-normal"}">${escape(title)} <button>${validate_component(Icon, "Icon").$$render($$result, { icon: "material-symbols:close" }, {}, {})}</button></div></div>`;
  })() : ``}`;
});
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $ui, $$unsubscribe_ui;
  $$unsubscribe_ui = subscribe(ui, (value) => $ui = value);
  $$unsubscribe_ui();
  return `${$ui.modal ? (() => {
    let { title, body, details, actions } = $ui.modal;
    return ` <div class="modal modal-open"><div class="modal-box"> <div class="flex items-center justify-between"><h3 class="font-bold text-lg">${escape(title)}</h3> ${details ? `<button>${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        icon: "material-symbols:info",
        width: "24",
        class: "text-info cursor-pointer"
      },
      {},
      {}
    )}</button>` : ``}</div>  ${body ? `<p class="pt-2">${escape(body)}</p>` : ``}  ${``}  ${actions ? `<div class="modal-action">${each(actions, (action) => {
      let { name, onClick } = action;
      return ` <button class="${"btn btn-sm w-24 " + escape(action.class, true)}">${escape(name)} </button>`;
    })}</div>` : ``}</div></div>`;
  })() : ``}`;
});
const css = {
  code: ".circle.svelte-1w4sjib{width:var(--size);height:var(--size);box-sizing:border-box;position:relative;border:3px solid transparent;border-top-color:var(--colorOuter);border-radius:50%;animation:svelte-1w4sjib-circleSpin var(--durationOuter) linear infinite}.circle.svelte-1w4sjib::before,.circle.svelte-1w4sjib::after{content:'';box-sizing:border-box;position:absolute;border:3px solid transparent;border-radius:50%}.circle.svelte-1w4sjib::after{border-top-color:var(--colorInner);top:9px;left:9px;right:9px;bottom:9px;animation:svelte-1w4sjib-circleSpin var(--durationInner) linear infinite}.circle.svelte-1w4sjib::before{border-top-color:var(--colorCenter);top:3px;left:3px;right:3px;bottom:3px;animation:svelte-1w4sjib-circleSpin var(--durationCenter) linear infinite}.pause-animation.svelte-1w4sjib,.pause-animation.svelte-1w4sjib::after,.pause-animation.svelte-1w4sjib::before{animation-play-state:paused}@keyframes svelte-1w4sjib-circleSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
  map: null
};
const Circle2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "60" } = $$props;
  let { unit = "px" } = $$props;
  let { pause = false } = $$props;
  let { colorOuter = "#FF3E00" } = $$props;
  let { colorCenter = "#40B3FF" } = $$props;
  let { colorInner = "#676778" } = $$props;
  let { durationMultiplier = 1 } = $$props;
  let { durationOuter = `${durationMultiplier * 2}s` } = $$props;
  let { durationInner = `${durationMultiplier * 1.5}s` } = $$props;
  let { durationCenter = `${durationMultiplier * 3}s` } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.pause === void 0 && $$bindings.pause && pause !== void 0)
    $$bindings.pause(pause);
  if ($$props.colorOuter === void 0 && $$bindings.colorOuter && colorOuter !== void 0)
    $$bindings.colorOuter(colorOuter);
  if ($$props.colorCenter === void 0 && $$bindings.colorCenter && colorCenter !== void 0)
    $$bindings.colorCenter(colorCenter);
  if ($$props.colorInner === void 0 && $$bindings.colorInner && colorInner !== void 0)
    $$bindings.colorInner(colorInner);
  if ($$props.durationMultiplier === void 0 && $$bindings.durationMultiplier && durationMultiplier !== void 0)
    $$bindings.durationMultiplier(durationMultiplier);
  if ($$props.durationOuter === void 0 && $$bindings.durationOuter && durationOuter !== void 0)
    $$bindings.durationOuter(durationOuter);
  if ($$props.durationInner === void 0 && $$bindings.durationInner && durationInner !== void 0)
    $$bindings.durationInner(durationInner);
  if ($$props.durationCenter === void 0 && $$bindings.durationCenter && durationCenter !== void 0)
    $$bindings.durationCenter(durationCenter);
  $$result.css.add(css);
  return `<div class="${["circle svelte-1w4sjib", pause ? "pause-animation" : ""].join(" ").trim()}" style="${"--size: " + escape(size, true) + escape(unit, true) + "; --colorInner: " + escape(colorInner, true) + "; --colorCenter: " + escape(colorCenter, true) + "; --colorOuter: " + escape(colorOuter, true) + "; --durationInner: " + escape(durationInner, true) + "; --durationCenter: " + escape(durationCenter, true) + "; --durationOuter: " + escape(durationOuter, true) + ";"}"></div>`;
});
const Loader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "Loading" } = $$props;
  let { size = 100 } = $$props;
  let { overlay = true } = $$props;
  let { center = true } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.overlay === void 0 && $$bindings.overlay && overlay !== void 0)
    $$bindings.overlay(overlay);
  if ($$props.center === void 0 && $$bindings.center && center !== void 0)
    $$bindings.center(center);
  return `<div${add_attribute("class", `${center && "fixed inset-0"} ${overlay ? "z-50 bg-base-200 bg-opacity-60" : "-z-50"} flex flex-col justify-center items-center`, 0)}>${validate_component(Circle2, "Circle2").$$render(
    $$result,
    {
      size,
      colorOuter: "hsl(var(--p))",
      colorCenter: "hsl(var(--s))",
      colorInner: "hsl(var(--a))"
    },
    {},
    {}
  )} <div class="font-semibold mt-5 bg-base-200 p-2 rounded-box">${escape(title)} ...</div></div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let loader;
  let path;
  let $page, $$unsubscribe_page;
  let $ui, $$unsubscribe_ui;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_ui = subscribe(ui, (value) => $ui = value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  ({ loader } = $ui);
  path = $page.url.pathname;
  $$unsubscribe_page();
  $$unsubscribe_ui();
  return `${appUrls.sessionRestricted.includes(path) || !appUrls.public.includes(path) ? `${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})}` : ``} ${loader ? (() => {
    let { title, overlay } = loader;
    return ` ${validate_component(Loader, "Loader").$$render($$result, { title, overlay: overlay ?? true }, {}, {})}`;
  })() : ``} ${!loader || loader.overlay !== false ? `${appUrls.sessionRestricted.includes(path) || !appUrls.public.includes(path) ? `<div class="py-6">${slots.default ? slots.default({}) : ``}</div>` : `${slots.default ? slots.default({}) : ``}`}` : ``} ${validate_component(Modal, "Modal").$$render($$result, {}, {}, {})} ${validate_component(Toast, "Toast").$$render($$result, {}, {}, {})}`;
});
export {
  Layout as default
};
