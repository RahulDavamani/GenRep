/*
  Warnings:

  - A unique constraint covering the columns `[reportId,name]` on the table `CardComponent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Dataset` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dataset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "databaseId" TEXT,
    "reportId" TEXT NOT NULL,
    CONSTRAINT "Dataset_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Dataset_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Dataset" ("databaseId", "id", "query", "reportId") SELECT "databaseId", "id", "query", "reportId" FROM "Dataset";
DROP TABLE "Dataset";
ALTER TABLE "new_Dataset" RENAME TO "Dataset";
CREATE UNIQUE INDEX "Dataset_id_key" ON "Dataset"("id");
CREATE UNIQUE INDEX "Dataset_reportId_key" ON "Dataset"("reportId");
CREATE UNIQUE INDEX "Dataset_reportId_name_key" ON "Dataset"("reportId", "name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "CardComponent_reportId_name_key" ON "CardComponent"("reportId", "name");
