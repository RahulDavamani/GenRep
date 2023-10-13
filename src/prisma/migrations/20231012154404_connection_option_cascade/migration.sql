-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConnectionOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "databaseName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "databaseId" TEXT NOT NULL,
    CONSTRAINT "ConnectionOption_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ConnectionOption" ("databaseId", "databaseName", "host", "id", "password", "port", "username") SELECT "databaseId", "databaseName", "host", "id", "password", "port", "username" FROM "ConnectionOption";
DROP TABLE "ConnectionOption";
ALTER TABLE "new_ConnectionOption" RENAME TO "ConnectionOption";
CREATE UNIQUE INDEX "ConnectionOption_id_key" ON "ConnectionOption"("id");
CREATE UNIQUE INDEX "ConnectionOption_databaseId_key" ON "ConnectionOption"("databaseId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
