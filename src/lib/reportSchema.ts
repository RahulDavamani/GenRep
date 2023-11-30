import { z } from 'zod';

export const upsertProperties = z.object({
	id: z.string().min(1),
	x: z.number(),
	y: z.number(),
	width: z.number().min(0),
	height: z.number().min(0),
	padding: z.number(),
	opacity: z.number().min(0).max(100),
	bgColor: z.string().min(1),
	textColor: z.string().min(1),
	shadow: z.string().min(1),
	rounded: z.string().min(1),
	border: z.boolean(),
	outline: z.boolean()
});

export const upsertInputComponentSchema = z.object({
	id: z.string().min(1),
	queryParamId: z.string().min(1).nullish(),
	name: z.string().min(1),

	label: z.string(),
	type: z.string().min(1),
	valueType: z.string().min(1).nullish(),
	values: z.string().min(1).nullish(),

	properties: upsertProperties
});

export const upsertButtonComponentSchema = z.object({
	id: z.string().min(1),
	datasetId: z.string().min(1).nullish(),
	name: z.string().min(1),

	type: z.string().min(1),
	text: z.string(),

	properties: upsertProperties
});

export const upsertCardComponentSchema = z.object({
	id: z.string().min(1),
	datasetId: z.string().min(1).nullish(),
	name: z.string().min(1),

	label: z.string(),
	column: z.string().min(1),
	rowNumber: z.number().min(1),

	properties: upsertProperties
});

export const upsertTableComponentSchema = z.object({
	id: z.string().min(1),
	datasetId: z.string().min(1).nullish(),
	name: z.string().min(1),

	label: z.string(),
	columns: z.string().min(1),
	rows: z.literal('').or(
		z
			.string()
			.regex(/^\d+-\d+$/)
			.min(1)
	),
	searching: z.boolean(),
	ordering: z.boolean(),
	paging: z.boolean(),
	info: z.boolean(),

	properties: upsertProperties
});

export const upsertDatasetSchema = z.object({
	id: z.string().min(1),
	databaseId: z.string().min(1).nullish(),
	name: z.string().min(1),
	query: z.string().min(1),
	queryParams: z.array(
		z.object({
			id: z.string(),
			key: z.string().min(1),
			value: z.string()
		})
	)
});

export const upsertReportSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	description: z.string(),
	theme: z.string().min(1),
	canvasHeight: z.number(),
	datasets: z.array(upsertDatasetSchema),
	inputComponents: z.array(upsertInputComponentSchema),
	buttonComponents: z.array(upsertButtonComponentSchema),
	cardComponents: z.array(upsertCardComponentSchema),
	tableComponents: z.array(upsertTableComponentSchema)
});

export type UpsertReport = z.infer<typeof upsertReportSchema>;
export type UpsertDataset = z.infer<typeof upsertDatasetSchema>;
export type UpsertInputComponent = z.infer<typeof upsertInputComponentSchema>;
export type UpsertButtonComponent = z.infer<typeof upsertButtonComponentSchema>;
export type UpsertCardComponent = z.infer<typeof upsertCardComponentSchema>;
export type UpsertTableComponent = z.infer<typeof upsertTableComponentSchema>;
export type UpsertProperties = z.infer<typeof upsertProperties>;
