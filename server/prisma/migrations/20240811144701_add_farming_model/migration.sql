-- CreateTable
CREATE TABLE "farming" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "total_seconds" INTEGER NOT NULL,
    "is_completed" BOOLEAN DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "farming_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "farming" ADD CONSTRAINT "farming_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
