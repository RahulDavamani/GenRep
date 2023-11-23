import { z } from 'zod';

export const upsertProperties = z.object({
	id: z.string().min(1),
	x: z.number(),
	y: z.number(),
	width: z.number(),
	height: z.number(),
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
	cardComponents: z.array(upsertCardComponentSchema),
	tableComponents: z.array(upsertTableComponentSchema)
});

export type UpsertReport = z.infer<typeof upsertReportSchema>;
export type UpsertDataset = z.infer<typeof upsertDatasetSchema>;
export type UpsertInputComponent = z.infer<typeof upsertInputComponentSchema>;
export type UpsertCardComponent = z.infer<typeof upsertCardComponentSchema>;
export type UpsertTableComponent = z.infer<typeof upsertTableComponentSchema>;
export type UpsertProperties = z.infer<typeof upsertProperties>;
