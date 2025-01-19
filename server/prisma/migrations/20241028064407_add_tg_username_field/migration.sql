/*
  Warnings:

  - A unique constraint covering the columns `[tg_username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "tg_username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_tg_username_key" ON "user"("tg_username");
