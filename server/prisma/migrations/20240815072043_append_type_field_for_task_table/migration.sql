-- CreateEnum
CREATE TYPE "TypeTask" AS ENUM ('socials', 'airdrop', 'promo', 'general');

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "type" "TypeTask" NOT NULL DEFAULT 'general';
