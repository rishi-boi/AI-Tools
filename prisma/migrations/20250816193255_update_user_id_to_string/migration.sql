/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `longDescription` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Tool` table. All the data in the column will be lost.
  - The primary key for the `Upvote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tool" DROP CONSTRAINT "Tool_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."Upvote" DROP CONSTRAINT "Upvote_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Review" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Tool" DROP COLUMN "logoUrl",
DROP COLUMN "longDescription",
DROP COLUMN "shortDescription",
ADD COLUMN     "description" TEXT,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Upvote" DROP CONSTRAINT "Upvote_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Upvote_pkey" PRIMARY KEY ("toolId", "userId");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "public"."Tool" ADD CONSTRAINT "Tool_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Upvote" ADD CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
