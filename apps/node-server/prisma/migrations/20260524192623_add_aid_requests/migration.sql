/*
  Warnings:

  - Added the required column `amountRequested` to the `AidRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `AidRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requesterName` to the `AidRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resourceType` to the `AidRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supportType` to the `AidRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tribeId` to the `AidRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AidRequest" ADD COLUMN     "amountRequested" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "requesterName" TEXT NOT NULL,
ADD COLUMN     "resourceType" TEXT NOT NULL,
ADD COLUMN     "supportType" TEXT NOT NULL,
ADD COLUMN     "tribeId" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'open';

-- AddForeignKey
ALTER TABLE "AidRequest" ADD CONSTRAINT "AidRequest_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
