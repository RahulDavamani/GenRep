-- CreateTable
CREATE TABLE "TableComponent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "columns" TEXT NOT NULL,
    "rows" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "datasetId" TEXT,
    "propertiesId" TEXT NOT NULL,
    CONSTRAINT "TableComponent_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TableComponent_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TableComponent_propertiesId_fkey" FOREIGN KEY ("propertiesId") REFERENCES "ComponentProperties" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TableComponent_id_key" ON "TableComponent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TableComponent_propertiesId_key" ON "TableComponent"("propertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "TableComponent_reportId_name_key" ON "TableComponent"("reportId", "name");
