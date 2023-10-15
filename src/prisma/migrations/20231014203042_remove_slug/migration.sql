/*
  Warnings:

  - You are about to drop the column `slug` on the `Report` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("description", "id", "name", "theme", "userId") SELECT "description", "id", "name", "theme", "userId" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");
CREATE UNIQUE INDEX "Report_userId_name_key" ON "Report"("userId", "name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
