import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { b as getErrorCode } from "./componentTypes.js";
import { e as error } from "./index.js";
import { u as ui } from "./ui.store.js";
const trpcClientErrorHandler = (e, callback, { stopLoading = true, showToast = true } = {}) => {
  const { code, message, zodErrors } = trpcErrorhandler(e);
  if (callback)
    callback({ code, message, zodErrors });
  if (stopLoading)
    ui.update((state) => ({ ...state, loader: void 0 }));
  if (showToast)
    ui.showToast({ class: "alert-error", title: `${code}: ${message}` });
  throw `${code}: ${message}`;
};
const trpcServerErrorHandler = (e) => {
  const { code, message } = trpcErrorhandler(e);
  throw error(code, { message });
};
const trpcErrorhandler = (e) => {
  console.log(e);
  if (e instanceof TRPCClientError) {
    try {
      const errors = JSON.parse(e.message);
      if (typeof errors === "object" && "path" in errors[0])
        return {
          code: e.data.httpStatus,
          message: "Input Validation Error",
          zodErrors: formatZodErrors(errors)
        };
    } catch (_) {
      return {
        code: e.data.httpStatus,
        message: e.message
      };
    }
  }
  if (e instanceof TRPCError)
    return {
      code: getErrorCode({ trpc: e.code })?.http ?? 500,
      message: e.message
    };
  return {
    code: 500,
    message: "Internal Server Error"
  };
};
const formatZodErrors = (errors) => {
  const formattedErrors = {};
  errors.forEach((error2) => {
    const path = error2.path;
    let currentObj = formattedErrors;
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (i === path.length - 1) {
        currentObj[key] = error2;
      } else {
        currentObj[key] = currentObj[key] || {};
        currentObj = currentObj[key];
      }
    }
  });
  return formattedErrors;
};
export {
  trpcClientErrorHandler as a,
  trpcServerErrorHandler as t
};
