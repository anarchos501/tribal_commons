ALTER TABLE "SupportRequest" ADD COLUMN "requestedFromType" TEXT NOT NULL DEFAULT 'individuals';
ALTER TABLE "SupportRequest" ADD COLUMN "commonsPoolId" INTEGER;

UPDATE "SupportRequest"
SET "requestedFromType" = CASE
  WHEN "supportType" = 'commons' THEN 'tribal_commons_pool'
  ELSE 'individuals'
END;

CREATE TABLE "SupportRequestSupport" (
    "id" SERIAL NOT NULL,
    "supporterName" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supportRequestId" INTEGER NOT NULL,
    "supporterCharacterId" INTEGER,

    CONSTRAINT "SupportRequestSupport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SupportRequestSupport_supportRequestId_supporterName_key"
ON "SupportRequestSupport"("supportRequestId", "supporterName");

ALTER TABLE "SupportRequest" ADD CONSTRAINT "SupportRequest_commonsPoolId_fkey"
FOREIGN KEY ("commonsPoolId") REFERENCES "CommonsPool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SupportRequestSupport" ADD CONSTRAINT "SupportRequestSupport_supportRequestId_fkey"
FOREIGN KEY ("supportRequestId") REFERENCES "SupportRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SupportRequestSupport" ADD CONSTRAINT "SupportRequestSupport_supporterCharacterId_fkey"
FOREIGN KEY ("supporterCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
