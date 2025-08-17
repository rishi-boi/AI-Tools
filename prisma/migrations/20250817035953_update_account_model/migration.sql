/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "accountId" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "providerId" TEXT NOT NULL,
ALTER COLUMN "provider" DROP NOT NULL,
ALTER COLUMN "providerAccountId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountId_key" ON "public"."Account"("accountId");
