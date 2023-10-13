-- CreateTable
CREATE TABLE "Database" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL,
    "connectionString" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Database_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConnectionOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "databaseName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "databaseId" TEXT NOT NULL,
    CONSTRAINT "ConnectionOption_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Database_id_key" ON "Database"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionOption_id_key" ON "ConnectionOption"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionOption_databaseId_key" ON "ConnectionOption"("databaseId");
