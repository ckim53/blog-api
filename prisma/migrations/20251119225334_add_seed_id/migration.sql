/*
  Warnings:

  - A unique constraint covering the columns `[seedId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "seedId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Post_seedId_key" ON "public"."Post"("seedId");
