-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "dairy_configs" (
    "id" TEXT NOT NULL,
    "buyerName" TEXT,
    "pricePerLiter" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentFrequency" "PaymentFrequency" NOT NULL DEFAULT 'MONTHLY',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "farmId" TEXT NOT NULL,

    CONSTRAINT "dairy_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milk_sales" (
    "id" TEXT NOT NULL,
    "saleDate" DATE NOT NULL,
    "liters" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "farmId" TEXT NOT NULL,

    CONSTRAINT "milk_sales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dairy_configs_farmId_key" ON "dairy_configs"("farmId");

-- AddForeignKey
ALTER TABLE "dairy_configs" ADD CONSTRAINT "dairy_configs_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milk_sales" ADD CONSTRAINT "milk_sales_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
