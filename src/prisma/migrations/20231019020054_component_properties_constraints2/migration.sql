-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ComponentProperties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "border" BOOLEAN NOT NULL,
    "outline" BOOLEAN NOT NULL,
    "shadow" TEXT NOT NULL DEFAULT 'shadow-none',
    "rounded" TEXT NOT NULL DEFAULT 'rounded-2xl'
);
INSERT INTO "new_ComponentProperties" ("bgColor", "border", "height", "id", "outline", "rounded", "shadow", "textColor", "width", "x", "y") SELECT "bgColor", "border", "height", "id", "outline", coalesce("rounded", 'rounded-2xl') AS "rounded", coalesce("shadow", 'shadow-none') AS "shadow", "textColor", "width", "x", "y" FROM "ComponentProperties";
DROP TABLE "ComponentProperties";
ALTER TABLE "new_ComponentProperties" RENAME TO "ComponentProperties";
CREATE UNIQUE INDEX "ComponentProperties_id_key" ON "ComponentProperties"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
