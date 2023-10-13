import { TRPCClientError } from '@trpc/client';

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

export interface TRPCResponseError {
	code: number;
	message: string;
	zodErrors?: TRPCZodErrors;
}

export const trpcErrorhandler = (e: unknown): TRPCResponseError => {
	console.log(e);
	if (e instanceof TRPCClientError) {
		try {
			const errors = JSON.parse(e.message);
			if (typeof errors === 'object' && 'path' in errors[0])
				return {
					code: 400,
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
