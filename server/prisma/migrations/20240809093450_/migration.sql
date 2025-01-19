/*
  Warnings:

  - You are about to drop the column `is_completed` on the `task` table. All the data in the column will be lost.
  - Added the required column `title` to the `user_tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "is_completed";

-- AlterTable
ALTER TABLE "user_tasks" ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT NOT NULL;
