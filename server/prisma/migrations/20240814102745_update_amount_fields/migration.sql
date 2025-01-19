/*
  Warnings:

  - You are about to alter the column `amount` on the `farming` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(12,3)`.
  - You are about to alter the column `earn` on the `friend` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(12,3)`.
  - You are about to alter the column `balance` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(12,3)`.

*/
-- AlterTable
ALTER TABLE "farming" ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,3);

-- AlterTable
ALTER TABLE "friend" ALTER COLUMN "earn" SET DEFAULT 0,
ALTER COLUMN "earn" SET DATA TYPE DECIMAL(12,3);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(12,3);
