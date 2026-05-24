-- CreateTable
CREATE TABLE "Petition" (
    "id" SERIAL NOT NULL,
    "signer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Petition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
