/*
  Warnings:

  - You are about to drop the column `proceso` on the `Machine` table. All the data in the column will be lost.
  - Added the required column `process` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "proceso",
ADD COLUMN     "img" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "operator" TEXT,
ADD COLUMN     "process" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DISPONIBLE';
