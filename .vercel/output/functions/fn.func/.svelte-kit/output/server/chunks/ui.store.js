import { w as writable } from "./index2.js";
const ui = (() => {
  const { subscribe, set, update } = writable({});
  const setLoader = (loader) => update((state) => ({ ...state, loader }));
  const setTheme = (theme) => document.querySelector("html")?.setAttribute("data-theme", theme);
  const showToast = (toast) => {
    update((state) => {
      clearInterval(state.toastInterval);
      return {
        ...state,
        toast,
        toastInterval: setInterval(() => update((state2) => ({ ...state2, toast: void 0 })), 5e3)
      };
    });
  };
  const closeToast = () => {
    update((state) => {
      clearTimeout(state.toastInterval);
      return { ...state, toast: void 0 };
    });
  };
  return {
    subscribe,
    set,
    update,
    setLoader,
    setTheme,
    showToast,
    closeToast
  };
})();
export {
  ui as u
};
