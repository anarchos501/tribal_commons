-- AlterTable
ALTER TABLE "Contribution" RENAME CONSTRAINT "Donation_pkey" TO "Contribution_pkey";

-- AlterTable
ALTER TABLE "SupportRequest" RENAME CONSTRAINT "AidRequest_pkey" TO "SupportRequest_pkey";

-- RenameForeignKey
ALTER TABLE "Contribution" RENAME CONSTRAINT "Donation_projectId_fkey" TO "Contribution_projectId_fkey";

-- RenameForeignKey
ALTER TABLE "SupportRequest" RENAME CONSTRAINT "AidRequest_tribeId_fkey" TO "SupportRequest_tribeId_fkey";
