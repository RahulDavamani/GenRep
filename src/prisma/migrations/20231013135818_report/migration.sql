-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dataset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "query" TEXT NOT NULL,
    "databaseId" TEXT,
    "reportId" TEXT NOT NULL,
    CONSTRAINT "Dataset_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Dataset_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CardComponent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "column" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "reportDataId" TEXT NOT NULL,
    "propertiesId" TEXT NOT NULL,
    CONSTRAINT "CardComponent_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CardComponent_reportDataId_fkey" FOREIGN KEY ("reportDataId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CardComponent_propertiesId_fkey" FOREIGN KEY ("propertiesId") REFERENCES "ComponentProperties" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ComponentProperties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'wireframe'
);
INSERT INTO "new_User" ("email", "id", "name", "theme") SELECT "email", "id", "name", "theme" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_userId_name_key" ON "Report"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Report_userId_slug_key" ON "Report"("userId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Dataset_id_key" ON "Dataset"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Dataset_reportId_key" ON "Dataset"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "CardComponent_id_key" ON "CardComponent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CardComponent_reportId_key" ON "CardComponent"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "CardComponent_propertiesId_key" ON "CardComponent"("propertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentProperties_id_key" ON "ComponentProperties"("id");
