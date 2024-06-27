/*
  Warnings:

  - You are about to drop the `foundItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "claims" DROP CONSTRAINT "claims_foundItemId_fkey";

-- DropForeignKey
ALTER TABLE "foundItems" DROP CONSTRAINT "foundItems_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "foundItems" DROP CONSTRAINT "foundItems_userId_fkey";

-- AlterTable
ALTER TABLE "lost_items" ADD COLUMN     "photo" TEXT;

-- DropTable
DROP TABLE "foundItems";

-- CreateTable
CREATE TABLE "found_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "foundItemName" TEXT NOT NULL,
    "photo" TEXT,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "found_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "found_items" ADD CONSTRAINT "found_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "found_items" ADD CONSTRAINT "found_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "foundItemCategorys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_foundItemId_fkey" FOREIGN KEY ("foundItemId") REFERENCES "found_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
