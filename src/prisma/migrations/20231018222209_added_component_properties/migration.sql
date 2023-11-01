-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ComponentProperties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bgColor" TEXT,
    "textColor" TEXT,
    "border" BOOLEAN NOT NULL DEFAULT false,
    "outline" BOOLEAN NOT NULL DEFAULT false,
    "shadow" TEXT,
    "rounded" TEXT
);
INSERT INTO "new_ComponentProperties" ("height", "id", "width", "x", "y") SELECT "height", "id", "width", "x", "y" FROM "ComponentProperties";
DROP TABLE "ComponentProperties";
ALTER TABLE "new_ComponentProperties" RENAME TO "ComponentProperties";
CREATE UNIQUE INDEX "ComponentProperties_id_key" ON "ComponentProperties"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
