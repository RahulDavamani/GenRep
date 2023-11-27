# Details

Date : 2023-11-27 20:18:14

Directory c:\\Users\\rahul\\OneDrive\\Documents\\Projects\\GenRep

Total : 87 files,  8351 codes, 46 comments, 1129 blanks, all 9526 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.eslintrc.cjs](/.eslintrc.cjs) | JavaScript | 25 | 0 | 1 | 26 |
| [.prettierignore](/.prettierignore) | Ignore | 11 | 1 | 2 | 14 |
| [.prettierrc](/.prettierrc) | JSON | 9 | 0 | 1 | 10 |
| [README.md](/README.md) | Markdown | 19 | 0 | 10 | 29 |
| [package.json](/package.json) | JSON | 68 | 0 | 1 | 69 |
| [pnpm-lock.yaml](/pnpm-lock.yaml) | YAML | 4,082 | 0 | 604 | 4,686 |
| [postcss.config.js](/postcss.config.js) | JavaScript | 6 | 0 | 1 | 7 |
| [src/app.css](/src/app.css) | CSS | 6 | 0 | 2 | 8 |
| [src/app.d.ts](/src/app.d.ts) | TypeScript | 22 | 4 | 2 | 28 |
| [src/app.html](/src/app.html) | HTML | 11 | 0 | 1 | 12 |
| [src/hooks.server.ts](/src/hooks.server.ts) | TypeScript | 21 | 4 | 8 | 33 |
| [src/lib/client/copyToClipboard.ts](/src/lib/client/copyToClipboard.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/lib/client/interact.ts](/src/lib/client/interact.ts) | TypeScript | 65 | 0 | 3 | 68 |
| [src/lib/client/queryParams.ts](/src/lib/client/queryParams.ts) | TypeScript | 10 | 0 | 3 | 13 |
| [src/lib/client/triggerAction.ts](/src/lib/client/triggerAction.ts) | TypeScript | 30 | 0 | 5 | 35 |
| [src/lib/data/appUrls.ts](/src/lib/data/appUrls.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [src/lib/data/buttonComponentTypes.ts](/src/lib/data/buttonComponentTypes.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [src/lib/data/componentProperties.ts](/src/lib/data/componentProperties.ts) | TypeScript | 45 | 0 | 5 | 50 |
| [src/lib/data/componentTypes.ts](/src/lib/data/componentTypes.ts) | TypeScript | 246 | 3 | 22 | 271 |
| [src/lib/data/databaseProviders.ts](/src/lib/data/databaseProviders.ts) | TypeScript | 30 | 0 | 2 | 32 |
| [src/lib/data/errorCodes.ts](/src/lib/data/errorCodes.ts) | TypeScript | 91 | 0 | 4 | 95 |
| [src/lib/data/inputComponentTypes.ts](/src/lib/data/inputComponentTypes.ts) | TypeScript | 12 | 0 | 1 | 13 |
| [src/lib/data/themes.ts](/src/lib/data/themes.ts) | TypeScript | 31 | 0 | 1 | 32 |
| [src/lib/formDataToObject.ts](/src/lib/formDataToObject.ts) | TypeScript | 19 | 1 | 6 | 26 |
| [src/lib/objectToFormData.ts](/src/lib/objectToFormData.ts) | TypeScript | 19 | 0 | 2 | 21 |
| [src/lib/reportSchema.ts](/src/lib/reportSchema.ts) | TypeScript | 89 | 0 | 17 | 106 |
| [src/lib/server/knex/queryDb.ts](/src/lib/server/knex/queryDb.ts) | TypeScript | 29 | 0 | 3 | 32 |
| [src/lib/server/knex/testDBConnection.ts](/src/lib/server/knex/testDBConnection.ts) | TypeScript | 28 | 0 | 3 | 31 |
| [src/lib/server/lucia.ts](/src/lib/server/lucia.ts) | TypeScript | 22 | 0 | 4 | 26 |
| [src/prisma/prisma.ts](/src/prisma/prisma.ts) | TypeScript | 4 | 0 | 3 | 7 |
| [src/prisma/prismaErrorHandler.ts](/src/prisma/prismaErrorHandler.ts) | TypeScript | 16 | 0 | 3 | 19 |
| [src/prisma/schema.prisma](/src/prisma/schema.prisma) | Prisma | 195 | 2 | 46 | 243 |
| [src/routes/+error.svelte](/src/routes/+error.svelte) | Svelte | 8 | 0 | 2 | 10 |
| [src/routes/+layout.server.ts](/src/routes/+layout.server.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/routes/+layout.svelte](/src/routes/+layout.svelte) | Svelte | 33 | 0 | 6 | 39 |
| [src/routes/+page.server.ts](/src/routes/+page.server.ts) | TypeScript | 7 | 0 | 2 | 9 |
| [src/routes/+page.svelte](/src/routes/+page.svelte) | Svelte | 39 | 0 | 4 | 43 |
| [src/routes/components/Loader.svelte](/src/routes/components/Loader.svelte) | Svelte | 15 | 0 | 2 | 17 |
| [src/routes/components/Modal.svelte](/src/routes/components/Modal.svelte) | Svelte | 41 | 4 | 6 | 51 |
| [src/routes/components/Navbar.svelte](/src/routes/components/Navbar.svelte) | Svelte | 38 | 1 | 3 | 42 |
| [src/routes/components/Toast.svelte](/src/routes/components/Toast.svelte) | Svelte | 15 | 0 | 2 | 17 |
| [src/routes/login/+page.svelte](/src/routes/login/+page.svelte) | Svelte | 1 | 0 | 1 | 2 |
| [src/routes/login/google/+server.ts](/src/routes/login/google/+server.ts) | TypeScript | 18 | 1 | 2 | 21 |
| [src/routes/login/google/callback/+server.ts](/src/routes/login/google/callback/+server.ts) | TypeScript | 36 | 3 | 8 | 47 |
| [src/routes/logout/+page.server.ts](/src/routes/logout/+page.server.ts) | TypeScript | 9 | 0 | 2 | 11 |
| [src/routes/report-maker/+page.server.ts](/src/routes/report-maker/+page.server.ts) | TypeScript | 10 | 0 | 4 | 14 |
| [src/routes/report-maker/+page.svelte](/src/routes/report-maker/+page.svelte) | Svelte | 74 | 1 | 8 | 83 |
| [src/routes/report-maker/components/Canvas/ButtonComponent.svelte](/src/routes/report-maker/components/Canvas/ButtonComponent.svelte) | Svelte | 35 | 0 | 7 | 42 |
| [src/routes/report-maker/components/Canvas/CardComponent.svelte](/src/routes/report-maker/components/Canvas/CardComponent.svelte) | Svelte | 34 | 0 | 7 | 41 |
| [src/routes/report-maker/components/Canvas/InputComponent.svelte](/src/routes/report-maker/components/Canvas/InputComponent.svelte) | Svelte | 168 | 0 | 10 | 178 |
| [src/routes/report-maker/components/Canvas/ReportCanvas.svelte](/src/routes/report-maker/components/Canvas/ReportCanvas.svelte) | Svelte | 37 | 0 | 5 | 42 |
| [src/routes/report-maker/components/Canvas/TableComponent.svelte](/src/routes/report-maker/components/Canvas/TableComponent.svelte) | Svelte | 77 | 0 | 7 | 84 |
| [src/routes/report-maker/components/Datasets/Datasets.svelte](/src/routes/report-maker/components/Datasets/Datasets.svelte) | Svelte | 87 | 0 | 4 | 91 |
| [src/routes/report-maker/components/Datasets/UpsertDatasetModal.svelte](/src/routes/report-maker/components/Datasets/UpsertDatasetModal.svelte) | Svelte | 95 | 0 | 14 | 109 |
| [src/routes/report-maker/components/ReportForm.svelte](/src/routes/report-maker/components/ReportForm.svelte) | Svelte | 56 | 0 | 6 | 62 |
| [src/routes/report-maker/components/SelectTheme.svelte](/src/routes/report-maker/components/SelectTheme.svelte) | Svelte | 47 | 2 | 3 | 52 |
| [src/routes/report-maker/components/UpsertComponent/Components.svelte](/src/routes/report-maker/components/UpsertComponent/Components.svelte) | Svelte | 97 | 0 | 5 | 102 |
| [src/routes/report-maker/components/UpsertComponent/PropertiesForm.svelte](/src/routes/report-maker/components/UpsertComponent/PropertiesForm.svelte) | Svelte | 125 | 0 | 9 | 134 |
| [src/routes/report-maker/components/UpsertComponent/UpsertButtonComponent.svelte](/src/routes/report-maker/components/UpsertComponent/UpsertButtonComponent.svelte) | Svelte | 86 | 0 | 12 | 98 |
| [src/routes/report-maker/components/UpsertComponent/UpsertCardComponent.svelte](/src/routes/report-maker/components/UpsertComponent/UpsertCardComponent.svelte) | Svelte | 109 | 0 | 13 | 122 |
| [src/routes/report-maker/components/UpsertComponent/UpsertComponentList.svelte](/src/routes/report-maker/components/UpsertComponent/UpsertComponentList.svelte) | Svelte | 34 | 0 | 4 | 38 |
| [src/routes/report-maker/components/UpsertComponent/UpsertInputComponent.svelte](/src/routes/report-maker/components/UpsertComponent/UpsertInputComponent.svelte) | Svelte | 162 | 0 | 16 | 178 |
| [src/routes/report-maker/components/UpsertComponent/UpsertTableComponent.svelte](/src/routes/report-maker/components/UpsertComponent/UpsertTableComponent.svelte) | Svelte | 127 | 0 | 14 | 141 |
| [src/routes/report-maker/components/ViewDataset.svelte](/src/routes/report-maker/components/ViewDataset.svelte) | Svelte | 44 | 0 | 3 | 47 |
| [src/routes/settings/+page.server.ts](/src/routes/settings/+page.server.ts) | TypeScript | 8 | 0 | 3 | 11 |
| [src/routes/settings/+page.svelte](/src/routes/settings/+page.svelte) | Svelte | 23 | 0 | 3 | 26 |
| [src/routes/settings/components/ApiKeys.svelte](/src/routes/settings/components/ApiKeys.svelte) | Svelte | 99 | 0 | 7 | 106 |
| [src/routes/settings/components/Databases.svelte](/src/routes/settings/components/Databases.svelte) | Svelte | 123 | 0 | 10 | 133 |
| [src/routes/settings/components/Themes.svelte](/src/routes/settings/components/Themes.svelte) | Svelte | 42 | 2 | 5 | 49 |
| [src/routes/settings/components/UpsertApiKeyModal.svelte](/src/routes/settings/components/UpsertApiKeyModal.svelte) | Svelte | 69 | 0 | 8 | 77 |
| [src/routes/settings/components/UpsertDatabaseModal.svelte](/src/routes/settings/components/UpsertDatabaseModal.svelte) | Svelte | 185 | 9 | 15 | 209 |
| [src/routes/view-report/+page.server.ts](/src/routes/view-report/+page.server.ts) | TypeScript | 11 | 0 | 6 | 17 |
| [src/routes/view-report/+page.svelte](/src/routes/view-report/+page.svelte) | Svelte | 13 | 0 | 3 | 16 |
| [src/stores/report-maker.store.ts](/src/stores/report-maker.store.ts) | TypeScript | 195 | 3 | 28 | 226 |
| [src/stores/ui.store.ts](/src/stores/ui.store.ts) | TypeScript | 56 | 1 | 11 | 68 |
| [src/trpc/client.ts](/src/trpc/client.ts) | TypeScript | 10 | 0 | 3 | 13 |
| [src/trpc/routers/apiKey.router.ts](/src/trpc/routers/apiKey.router.ts) | TypeScript | 30 | 0 | 5 | 35 |
| [src/trpc/routers/app.router.ts](/src/trpc/routers/app.router.ts) | TypeScript | 20 | 0 | 5 | 25 |
| [src/trpc/routers/database.router.ts](/src/trpc/routers/database.router.ts) | TypeScript | 121 | 0 | 10 | 131 |
| [src/trpc/routers/report.router.ts](/src/trpc/routers/report.router.ts) | TypeScript | 114 | 2 | 13 | 129 |
| [src/trpc/routers/theme.router.ts](/src/trpc/routers/theme.router.ts) | TypeScript | 13 | 0 | 2 | 15 |
| [src/trpc/trpc.ts](/src/trpc/trpc.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [src/trpc/trpcErrorhandler.ts](/src/trpc/trpcErrorhandler.ts) | TypeScript | 89 | 0 | 17 | 106 |
| [svelte.config.js](/svelte.config.js) | JavaScript | 9 | 1 | 4 | 14 |
| [tailwind.config.js](/tailwind.config.js) | JavaScript | 41 | 1 | 1 | 43 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 13 | 0 | 1 | 14 |
| [vite.config.ts](/vite.config.ts) | TypeScript | 6 | 0 | 2 | 8 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)