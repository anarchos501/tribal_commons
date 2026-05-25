-- CreateTable
CREATE TABLE "FederationRelationship" (
    "id" SERIAL NOT NULL,
    "sourceTribeId" INTEGER NOT NULL,
    "targetTribeId" INTEGER NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FederationRelationship_pkey" PRIMARY KEY ("id")
);
