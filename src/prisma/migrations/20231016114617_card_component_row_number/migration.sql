/*
  Warnings:

  - Added the required column `rowNumber` to the `CardComponent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CardComponent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "column" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "reportId" TEXT NOT NULL,
    "datasetId" TEXT,
    "propertiesId" TEXT NOT NULL,
    CONSTRAINT "CardComponent_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CardComponent_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CardComponent_propertiesId_fkey" FOREIGN KEY ("propertiesId") REFERENCES "ComponentProperties" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CardComponent" ("column", "datasetId", "id", "name", "propertiesId", "reportId", "title") SELECT "column", "datasetId", "id", "name", "propertiesId", "reportId", "title" FROM "CardComponent";
DROP TABLE "CardComponent";
ALTER TABLE "new_CardComponent" RENAME TO "CardComponent";
CREATE UNIQUE INDEX "CardComponent_id_key" ON "CardComponent"("id");
CREATE UNIQUE INDEX "CardComponent_propertiesId_key" ON "CardComponent"("propertiesId");
CREATE UNIQUE INDEX "CardComponent_reportId_name_key" ON "CardComponent"("reportId", "name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
