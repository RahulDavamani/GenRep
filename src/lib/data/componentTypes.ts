import type {
	UpsertButtonComponent,
	UpsertCardComponent,
	UpsertInputComponent,
	UpsertProperties,
	UpsertTableComponent
} from '$lib/reportSchema';
import { nanoid } from 'nanoid';

// Types
export type ComponentKey = 'input' | 'button' | 'card' | 'table';

export type ComponentTypes = {
	[K in ComponentKey]: ComponentType<K>;
};
export type ComponentType<T extends ComponentKey> = {
	labels: ComponentLabels<T>;

	client: {
		icon: string;
		newComponent: UpsertComponent<T>;
		getTableValues: GetTableValues<T>;
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

export type UpsertComponents = {
	[K in ComponentKey as `upsert${Capitalize<K>}Component`]?: UpsertComponent<K>;
};

export type UpsertComponent<T extends ComponentKey> = T extends 'input'
	? UpsertInputComponent
	: T extends 'button'
	  ? UpsertButtonComponent
	  : T extends 'card'
	    ? UpsertCardComponent
	    : T extends 'table'
	      ? UpsertTableComponent
	      : never;

export type GetTableValues<T extends ComponentKey> = (component: UpsertComponent<T>) => {
	key: T;
	id: string;
	datasetId?: string | null;
	name: string;
	properties: UpsertProperties;
	values: { [k in string]: string };
};

export type ServerFn<T extends ComponentKey> = (
	reportId: string,
	userId: string,
	components: UpsertComponent<T>[]
) => void | Promise<void>;

export type prismaComponentFn = (
	reportId: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prismaTable: any,
	components: UpsertComponent<ComponentKey>[]
) => void | Promise<void>;

// Variables & Methods
export const defaultNewComponent: { id: string; name: string; properties: UpsertProperties } = {
	id: nanoid(),
	name: '',
	properties: {
		id: nanoid(),
		x: 500,
		y: 0,
		width: 200,
		height: 200,
		padding: 16,
		opacity: 100,
		bgColor: 'bg-base-100',
		textColor: 'text-base-content',
		shadow: 'shadow-none',
		rounded: 'rounded-2xl',
		border: true,
		outline: false
	}
};

export const getLabels = <T extends ComponentKey>(key: T): ComponentLabels<T> => {
	const Key = `${key[0].toUpperCase() + key.slice(1)}` as Capitalize<T>;
	return {
		key,
		Key,
		keyComponent: `${key}Component`,
		keyComponents: `${key}Components`,
		upsertKeyComponent: `upsert${Key}Component`
	};
};

export const prismaDeleteComponents: prismaComponentFn = async (reportId, prismaTable, components) => {
	const existingComponents = (await prismaTable.findMany({
		where: { reportId },
		select: { id: true }
	})) as { id: string }[];

	const deleteComponents = existingComponents.filter((ec) => !components.find((c) => ec.id === c.id)).map((d) => d.id);
	await prismaTable.deleteMany({ where: { id: { in: deleteComponents } } });
};

export const prismaUpsertComponents: prismaComponentFn = async (reportId, prismaTable, components) => {
	for (const { id, properties, ...values } of components) {
		const propertiesId = await prismaUpsertProperties(properties);
		await prismaTable.upsert({
			where: { id },
			create: {
				reportId,
				propertiesId,
				...values
			},
			update: { ...values }
		});
	}
};

export const prismaUpsertProperties = async (properties: UpsertProperties) => {
	const { id, ...values } = properties;
	return (
		await prisma.componentProperties.upsert({
			where: { id },
			create: values,
			update: values,
			select: { id: true }
		})
	).id;
};

export const createComponentType = (key: ComponentKey): ComponentType<ComponentKey> => {
	if (key === 'input')
		return {
			labels: getLabels(key),
			client: {
				icon: 'mdi:card-text',
				newComponent: {
					...defaultNewComponent,
					queryParamId: undefined,
					label: '',
					type: 'text'
				},
				getTableValues: ({ id, name, label, type, properties }) => ({
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
	else if (key === 'button')
		return {
			labels: getLabels(key),
			client: {
				icon: 'mdi:card-text',
				newComponent: {
					...defaultNewComponent,
					datasetId: undefined,
					type: '',
					text: ''
				},
				getTableValues: ({ id, datasetId, name, type, text, properties }) => ({
					key,
					id,
					datasetId,
					name,
					properties,
					values: { Type: type, Text: text }
				})
			},
			server: {}
		} as ComponentType<typeof key>;
	else if (key === 'card')
		return {
			labels: getLabels(key),
			client: {
				icon: 'mdi:card-text',
				newComponent: {
					...defaultNewComponent,
					datasetId: undefined,
					label: '',
					column: '',
					rowNumber: 1
				},
				getTableValues: ({ id, datasetId, name, label, column, rowNumber, properties }) => ({
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
				icon: 'mdi:table',
				newComponent: {
					...defaultNewComponent,
					datasetId: undefined,
					label: '',
					columns: '',
					rows: '',
					searching: true,
					sorting: true,
					paging: true,
					info: true
				},
				getTableValues: ({ id, datasetId, name, label, columns, rows, properties }) => ({
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
	button: createComponentType('button') as ComponentType<'button'>,
	card: createComponentType('card') as ComponentType<'card'>,
	table: createComponentType('table') as ComponentType<'table'>
};
export const componentKeys = Object.keys(componentTypes) as ComponentKey[];
export const componentTypesList = Object.values(componentTypes);

export const componentIncludes = Object.fromEntries(
	componentTypesList.map((ct) => [ct.labels.keyComponents, { include: { properties: true } }])
) as {
	[K in ComponentKey as `${K}Components`]: { include: { properties: true } };
};

export const getComponentStyle = (
	view: boolean,
	innerWidth: number,
	{ x, y, width, height, padding, opacity }: UpsertProperties
) => ({
	width: `${view ? (width / 1000) * innerWidth : width}px`,
	height: `${height}px`,
	transform: `translate(${view ? (x / 1000) * innerWidth : x}px, ${y}px)`,
	padding: `${padding}px`,
	opacity: opacity / 100
});

export const getComponentClass = (
	view: boolean,
	{ bgColor, textColor, shadow, rounded, border, outline }: UpsertProperties
) => `absolute flex flex-col justify-center items-center overflow-auto
   ${bgColor} ${textColor} ${shadow} ${rounded}
   ${border && 'border'} ${outline && 'outline'} 
   ${!view && 'hover:outline hover:outline-1 hover:outline-blue-300 active:outline-blue-700'}`;
