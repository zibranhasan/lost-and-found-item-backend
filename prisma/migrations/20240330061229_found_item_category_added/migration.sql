-- CreateTable
CREATE TABLE "foundItemCategorys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "foundItemCategorys_pkey" PRIMARY KEY ("id")
);
