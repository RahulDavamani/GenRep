/*
  Warnings:

  - You are about to drop the column `bgColor` on the `ComponentProperties` table. All the data in the column will be lost.
  - You are about to drop the column `textColor` on the `ComponentProperties` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ComponentProperties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL
);
INSERT INTO "new_ComponentProperties" ("height", "id", "width", "x", "y") SELECT "height", "id", "width", "x", "y" FROM "ComponentProperties";
DROP TABLE "ComponentProperties";
ALTER TABLE "new_ComponentProperties" RENAME TO "ComponentProperties";
CREATE UNIQUE INDEX "ComponentProperties_id_key" ON "ComponentProperties"("id");
CREATE TABLE "new_Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "canvasHeight" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("canvasHeight", "description", "id", "name", "theme", "userId") SELECT "canvasHeight", "description", "id", "name", "theme", "userId" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");
CREATE UNIQUE INDEX "Report_userId_name_key" ON "Report"("userId", "name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
