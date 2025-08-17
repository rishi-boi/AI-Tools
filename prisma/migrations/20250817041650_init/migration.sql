/*
  Warnings:

  - A unique constraint covering the columns `[providerId,accountId]` on the table `account` will be added. If there are existing duplicate values, this will fail.
  - Made the column `createdBy` on table `Tool` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Tool" DROP CONSTRAINT "Tool_createdBy_fkey";

-- AlterTable
ALTER TABLE "public"."Tool" ALTER COLUMN "createdBy" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "public"."account"("providerId", "accountId");

-- AddForeignKey
ALTER TABLE "public"."Tool" ADD CONSTRAINT "Tool_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
