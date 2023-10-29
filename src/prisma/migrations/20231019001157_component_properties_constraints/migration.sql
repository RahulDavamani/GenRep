-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ComponentProperties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bgColor" TEXT NOT NULL DEFAULT 'bg-base-100',
    "textColor" TEXT NOT NULL DEFAULT 'text-base-content',
    "border" BOOLEAN NOT NULL,
    "outline" BOOLEAN NOT NULL,
    "shadow" TEXT,
    "rounded" TEXT
);
INSERT INTO "new_ComponentProperties" ("bgColor", "border", "height", "id", "outline", "rounded", "shadow", "textColor", "width", "x", "y") SELECT coalesce("bgColor", 'bg-base-100') AS "bgColor", "border", "height", "id", "outline", "rounded", "shadow", coalesce("textColor", 'text-base-content') AS "textColor", "width", "x", "y" FROM "ComponentProperties";
DROP TABLE "ComponentProperties";
ALTER TABLE "new_ComponentProperties" RENAME TO "ComponentProperties";
CREATE UNIQUE INDEX "ComponentProperties_id_key" ON "ComponentProperties"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
