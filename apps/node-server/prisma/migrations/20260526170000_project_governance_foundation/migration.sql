ALTER TABLE "GovernanceTopic"
ADD COLUMN "projectId" INTEGER,
ADD COLUMN "scope" TEXT NOT NULL DEFAULT 'tribe';

CREATE TABLE "PetitionSponsor" (
  "id" SERIAL NOT NULL,
  "sponsorName" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "petitionId" INTEGER NOT NULL,
  "sponsorCharacterId" INTEGER,

  CONSTRAINT "PetitionSponsor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectMembership" (
  "id" SERIAL NOT NULL,
  "memberName" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "removedAt" TIMESTAMP(3),
  "projectId" INTEGER NOT NULL,
  "characterProfileId" INTEGER,

  CONSTRAINT "ProjectMembership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectAction" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "proposerName" TEXT NOT NULL,
  "resourceType" TEXT,
  "amount" INTEGER,
  "resourceNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "acceptedAt" TIMESTAMP(3),
  "archivedAt" TIMESTAMP(3),
  "projectId" INTEGER NOT NULL,
  "proposerCharacterId" INTEGER,

  CONSTRAINT "ProjectAction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectActionSupport" (
  "id" SERIAL NOT NULL,
  "supporterName" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actionId" INTEGER NOT NULL,
  "supporterCharacterId" INTEGER,

  CONSTRAINT "ProjectActionSupport_pkey" PRIMARY KEY ("id")
);

INSERT INTO "PetitionSponsor" (
  "sponsorName",
  "createdAt",
  "petitionId",
  "sponsorCharacterId"
)
SELECT
  "proposerName",
  "createdAt",
  "id",
  "proposerCharacterId"
FROM "Petition";

INSERT INTO "GovernanceTopic" (
  "tribeId",
  "projectId",
  "scope",
  "key",
  "title",
  "description",
  "minLabel",
  "maxLabel",
  "createdAt"
)
SELECT
  "tribeId",
  "id",
  'project',
  'project_action_approval_threshold',
  'Project Action Approval Threshold',
  'How much project member support is needed before an internal project action is accepted.',
  'Restrictive',
  'Open',
  CURRENT_TIMESTAMP
FROM "Project";

ALTER TABLE "GovernanceTopic" ADD CONSTRAINT "GovernanceTopic_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PetitionSponsor" ADD CONSTRAINT "PetitionSponsor_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PetitionSponsor" ADD CONSTRAINT "PetitionSponsor_sponsorCharacterId_fkey" FOREIGN KEY ("sponsorCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE UNIQUE INDEX "PetitionSponsor_petitionId_sponsorName_key" ON "PetitionSponsor"("petitionId", "sponsorName");

ALTER TABLE "ProjectMembership" ADD CONSTRAINT "ProjectMembership_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProjectMembership" ADD CONSTRAINT "ProjectMembership_characterProfileId_fkey" FOREIGN KEY ("characterProfileId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE UNIQUE INDEX "ProjectMembership_projectId_memberName_key" ON "ProjectMembership"("projectId", "memberName");

ALTER TABLE "ProjectAction" ADD CONSTRAINT "ProjectAction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProjectAction" ADD CONSTRAINT "ProjectAction_proposerCharacterId_fkey" FOREIGN KEY ("proposerCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProjectActionSupport" ADD CONSTRAINT "ProjectActionSupport_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "ProjectAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProjectActionSupport" ADD CONSTRAINT "ProjectActionSupport_supporterCharacterId_fkey" FOREIGN KEY ("supporterCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE UNIQUE INDEX "ProjectActionSupport_actionId_supporterName_key" ON "ProjectActionSupport"("actionId", "supporterName");
