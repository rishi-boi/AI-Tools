/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."account_providerId_accountId_key";

-- AlterTable
ALTER TABLE "public"."account" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."session" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "password",
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."verification" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
