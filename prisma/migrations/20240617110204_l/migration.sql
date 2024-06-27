/*
  Warnings:

  - You are about to drop the column `photo` on the `foundItems` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `lost_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "foundItems" DROP COLUMN "photo";

-- AlterTable
ALTER TABLE "lost_items" DROP COLUMN "photo";
