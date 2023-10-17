import { z } from 'zod';

export const upsertDatasetSchema = z.object({
	id: z.string(),
	databaseId: z.string().min(1).nullish(),
	name: z.string().min(1),
	query: z.string().min(1)
});

export const upsertCardComponentSchema = z.object({
	id: z.string(),
	datasetId: z.string().min(1).nullish(),
	name: z.string().min(1),
	title: z.string().min(1),
	column: z.string().min(1),
	rowNumber: z.number(),
	properties: z.object({
		id: z.string(),
		x: z.number(),
		y: z.number(),
		width: z.number(),
		height: z.number(),
		bgColor: z.string().min(1),
		textColor: z.string().min(1)
	})
});

export const upsertReportSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	description: z.string(),
	theme: z.string().min(1),
	datasets: z.array(upsertDatasetSchema),
	cardComponents: z.array(upsertCardComponentSchema)
});
export type UpsertReport = z.infer<typeof upsertReportSchema>;
export type UpsertDataset = z.infer<typeof upsertDatasetSchema>;
export type UpsertCardComponent = z.infer<typeof upsertCardComponentSchema>;
