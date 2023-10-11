import { writable } from 'svelte/store';

export interface UI {
	loader?: Loader;
	toast?: Toast;
	toastInterval?: NodeJS.Timeout;
	modal?: Modal;
}

export interface Loader {
	title?: string;
	overlay?: boolean;
}

export interface Toast {
	title: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	classes?: string;
}

export interface Modal {
	title: string;
	body?: string;
	details?: string;
	actions?: ModalAction[];
}
export interface ModalAction {
	name: string;
	type?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
	classes?: string;
	onClick?: () => void | Promise<void>;
}

export const ui = (() => {
	const { subscribe, set, update } = writable<UI>({});

	// Methods

	const setTheme = (theme: string) => document.querySelector('html')?.setAttribute('data-theme', theme);

	const showToast = (toast: Toast) => {
		update((state) => {
			clearInterval(state.toastInterval);
			return {
				...state,
				toast,
				toastInterval: setInterval(() => update((state) => ({ ...state, toast: undefined })), 50000)
			};
		});
	};

	const closeToast = () => {
		update((state) => {
			clearTimeout(state.toastInterval);
			return { ...state, toast: undefined };
		});
	};

	return {
		subscribe,
		set,
		update,
		setTheme,
		showToast,
		closeToast
	};
})();
