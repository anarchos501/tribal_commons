ALTER TABLE "Petition" ADD COLUMN "publishAt" TIMESTAMP(3);

ALTER TABLE "PetitionSponsor" ADD COLUMN "removedAt" TIMESTAMP(3);

ALTER TABLE "GovernanceTopic" ADD COLUMN "petitionId" INTEGER;

ALTER TABLE "ActivityEvent" ADD COLUMN "visibleToCharacterIds" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[];

CREATE TABLE "PetitionSponsorRequest" (
    "id" SERIAL NOT NULL,
    "requestType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requesterName" TEXT NOT NULL,
    "recipientName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "petitionId" INTEGER NOT NULL,
    "requesterCharacterId" INTEGER,
    "recipientCharacterId" INTEGER,

    CONSTRAINT "PetitionSponsorRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PetitionSponsorRequestPreference" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "voterName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sponsorRequestId" INTEGER NOT NULL,
    "voterCharacterId" INTEGER,

    CONSTRAINT "PetitionSponsorRequestPreference_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PetitionSponsorRequest_petitionId_requestType_requesterName_recipientName_key"
ON "PetitionSponsorRequest"("petitionId", "requestType", "requesterName", "recipientName");

CREATE UNIQUE INDEX "PetitionSponsorRequestPreference_sponsorRequestId_voterName_key"
ON "PetitionSponsorRequestPreference"("sponsorRequestId", "voterName");

ALTER TABLE "GovernanceTopic" ADD CONSTRAINT "GovernanceTopic_petitionId_fkey"
FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PetitionSponsorRequest" ADD CONSTRAINT "PetitionSponsorRequest_petitionId_fkey"
FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PetitionSponsorRequest" ADD CONSTRAINT "PetitionSponsorRequest_requesterCharacterId_fkey"
FOREIGN KEY ("requesterCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PetitionSponsorRequest" ADD CONSTRAINT "PetitionSponsorRequest_recipientCharacterId_fkey"
FOREIGN KEY ("recipientCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PetitionSponsorRequestPreference" ADD CONSTRAINT "PetitionSponsorRequestPreference_sponsorRequestId_fkey"
FOREIGN KEY ("sponsorRequestId") REFERENCES "PetitionSponsorRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PetitionSponsorRequestPreference" ADD CONSTRAINT "PetitionSponsorRequestPreference_voterCharacterId_fkey"
FOREIGN KEY ("voterCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
