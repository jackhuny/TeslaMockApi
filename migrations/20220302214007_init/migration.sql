-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "vehicleId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "State" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vehicleId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "State_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("vehicleId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vehicleId_key" ON "Vehicle"("vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "State_vehicleId_domain_item_key" ON "State"("vehicleId", "domain", "item");
