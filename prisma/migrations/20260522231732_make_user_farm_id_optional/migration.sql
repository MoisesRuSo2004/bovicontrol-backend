-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_farmId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "farmId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
