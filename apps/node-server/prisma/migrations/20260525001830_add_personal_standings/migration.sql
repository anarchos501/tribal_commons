-- CreateTable
CREATE TABLE "PersonalStanding" (
    "id" SERIAL NOT NULL,
    "observerName" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "tribeContextId" INTEGER,
    "value" INTEGER NOT NULL,
    "note" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalStanding_pkey" PRIMARY KEY ("id")
);
