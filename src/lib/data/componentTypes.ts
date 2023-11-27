import type {
	UpsertCardComponent,
	UpsertInputComponent,
	UpsertProperties,
	UpsertTableComponent
} from '$lib/reportSchema';
import { nanoid } from 'nanoid';

// Types
export type ComponentKey = 'input' | 'card' | 'table';
export type ComponentTypes = {
	[K in ComponentKey]: ComponentType<K>;
};

export type ComponentType<T extends ComponentKey> = {
	labels: ComponentLabels<T>;

	client: {
		newComponent: UpsertComponent<T>;
		getValues: GetValueFunc<T>;
	};

	server: {
		deleteFn?: ServerFn<T>;
		upsertFn?: ServerFn<T>;
	};
};

export type ComponentLabels<T extends ComponentKey> = {
	key: T;
	Key: Capitalize<T>;
	keyComponent: `${T}Component`;
	keyComponents: `${T}Components`;
	upsertKeyComponent: `upsert${Capitalize<T>}Component`;
};

export type UpsertComponent<T extends ComponentKey> = T extends 'input'
	? UpsertInputComponent
	: T extends 'card'
	? UpsertCardComponent
	: T extends 'table'
	? UpsertTableComponent
	: never;

export type UpsertComponents = {
	[K in ComponentKey as `upsert${Capitalize<K>}Component`]?: UpsertComponent<K>;
};

export type ServerFn<T extends ComponentKey> = (components: UpsertComponent<T>[]) => void | Promise<void>;

export type GetValueFunc<T extends ComponentKey> = (component: UpsertComponent<T>) => {
	key: T;
	id: string;
	datasetId?: string | null;
	name: string;
	properties: UpsertProperties;
	values: { [k in string]: string };
};

// Variables & Methods

const getLabels = <T extends ComponentKey>(key: T): ComponentLabels<T> => {
	const Key = `${key[0].toUpperCase() + key.slice(1)}` as Capitalize<T>;
	return {
		key,
		Key,
		keyComponent: `${key}Component`,
		keyComponents: `${key}Components`,
		upsertKeyComponent: `upsert${Key}Component`
	};
};

const defaultNewComponent = {
	id: nanoid(),
	name: '',
	properties: {
		id: nanoid(),
		x: 500,
		y: 0,
		width: 200,
		height: 200,
		bgColor: 'bg-base-100',
		textColor: 'text-base-content',
		shadow: 'shadow-none',
		rounded: 'rounded-2xl',
		border: true,
		outline: false
	}
};

export const createComponentType = (key: ComponentKey): ComponentType<ComponentKey> => {
	if (key === 'input')
		return {
			labels: getLabels(key),
			client: {
				newComponent: {
					...defaultNewComponent,
					queryParamId: undefined,
					label: '',
					type: 'text'
				},
				getValues: ({ id, name, label, type, properties }) => ({
					key,
					id,
					datasetId: undefined,
					name,
					properties,
					values: { Label: label, Type: type }
				})
			},
			server: {}
		} as ComponentType<typeof key>;
	else if (key === 'card')
		return {
			labels: getLabels(key),
			client: {
				newComponent: {
					...defaultNewComponent,
					datasetId: undefined,
					label: '',
					column: '',
					rowNumber: 1
				},
				getValues: ({ id, datasetId, name, label, column, rowNumber, properties }) => ({
					key,
					id,
					datasetId,
					name,
					properties,
					values: { Label: label, Column: column, ['Row Number']: rowNumber.toString() }
				})
			},
			server: {}
		} as ComponentType<typeof key>;
	else
		return {
			labels: getLabels(key),
			client: {
				newComponent: {
					...defaultNewComponent,
					datasetId: undefined,
					label: '',
					columns: '',
					rows: ''
				},
				getValues: ({ id, datasetId, name, label, columns, rows, properties }) => ({
					key,
					id,
					datasetId,
					name,
					properties,
					values: { Label: label, Columns: columns, ['Rows']: rows }
				})
			},
			server: {}
		} as ComponentType<typeof key>;
};

export const componentTypes: ComponentTypes = {
	input: createComponentType('input') as ComponentType<'input'>,
	card: createComponentType('card') as ComponentType<'card'>,
	table: createComponentType('table') as ComponentType<'table'>
};
export const componentKeys = Object.keys(componentTypes) as ComponentKey[];
export const componentTypesList = Object.values(componentTypes);
