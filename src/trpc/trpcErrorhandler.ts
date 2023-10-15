import { TRPCClientError } from '@trpc/client';
import { TRPCError } from '@trpc/server';
import { getErrorCode } from '../data/errorCodes';
import { error } from '@sveltejs/kit';
import { ui } from '../stores/ui.store';

export interface TRPCZodError {
	code: string;
	minimum: number;
	type: string;
	inclusive: boolean;
	exact: boolean;
	message: string;
	path: string[];
}

export interface TRPCZodErrors {
	[key: string]: TRPCZodError | TRPCZodErrors;
}

export interface TRPCHandlerError {
	code: number;
	message: string;
	zodErrors?: TRPCZodErrors;
}

export interface TRPCClientErrorHandlerOptions {
	throwError?: boolean;
	stopLoading?: boolean;
	showToast?: boolean;
}

export const trpcClientErrorHandler = (
	e: unknown,
	{ stopLoading = true, showToast = true, throwError = true }: TRPCClientErrorHandlerOptions = {}
) => {
	const { code, message, zodErrors } = trpcErrorhandler(e);

	if (stopLoading) ui.update((state) => ({ ...state, loader: undefined }));
	if (showToast) ui.showToast({ class: 'alert-error', title: `${code}: ${message}` });

	if (throwError) throw `${code}: ${message}`;
	return { code, message, zodErrors };
};

export const trpcServerErrorHandler = (e: unknown) => {
	const { code, message } = trpcErrorhandler(e);
	throw error(code, { message: message });
};

export const trpcErrorhandler = (e: unknown): TRPCHandlerError => {
	if (e instanceof TRPCClientError) {
		try {
			const errors = JSON.parse(e.message);
			if (typeof errors === 'object' && 'path' in errors[0])
				return {
					code: e.data.httpStatus,
					message: 'Input Validation Error',
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
		message: 'Internal Server Error'
	};
};

function formatZodErrors(errors: TRPCZodError[]): TRPCZodErrors {
	const formattedErrors: TRPCZodErrors = {};

	errors.forEach((error) => {
		const path = error.path;

		let currentObj: TRPCZodErrors = formattedErrors;

		for (let i = 0; i < path.length; i++) {
			const key = path[i];
			if (i === path.length - 1) {
				currentObj[key] = error;
			} else {
				currentObj[key] = currentObj[key] || {};
				currentObj = currentObj[key] as TRPCZodErrors;
			}
		}
	});

	return formattedErrors;
}
