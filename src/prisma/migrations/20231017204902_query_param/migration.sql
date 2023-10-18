-- CreateTable
CREATE TABLE "QueryParam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    CONSTRAINT "QueryParam_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "QueryParam_id_key" ON "QueryParam"("id");
