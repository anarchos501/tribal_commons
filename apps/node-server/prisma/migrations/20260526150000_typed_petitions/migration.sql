ALTER TABLE "Petition" DROP CONSTRAINT IF EXISTS "Petition_projectId_fkey";
ALTER TABLE "Petition" DROP CONSTRAINT IF EXISTS "Petition_signerCharacterId_fkey";

ALTER TABLE "Petition" RENAME TO "PetitionSupport";
ALTER TABLE "PetitionSupport" RENAME CONSTRAINT "Petition_pkey" TO "PetitionSupport_pkey";
ALTER SEQUENCE IF EXISTS "Petition_id_seq" RENAME TO "PetitionSupport_id_seq";
ALTER TABLE "PetitionSupport" ALTER COLUMN "id" SET DEFAULT nextval('"PetitionSupport_id_seq"');
ALTER TABLE "PetitionSupport" RENAME COLUMN "signer" TO "supporterName";
ALTER TABLE "PetitionSupport" RENAME COLUMN "signerCharacterId" TO "supporterCharacterId";

ALTER TABLE "PetitionSupport" ADD COLUMN "petitionId" INTEGER;

CREATE TABLE "Petition" (
  "id" SERIAL NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "proposerName" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "tribeId" INTEGER NOT NULL,
  "projectId" INTEGER,
  "targetTribeId" INTEGER,
  "proposerCharacterId" INTEGER,

  CONSTRAINT "Petition_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Petition" (
  "type",
  "title",
  "description",
  "status",
  "proposerName",
  "metadata",
  "createdAt",
  "updatedAt",
  "tribeId",
  "projectId",
  "proposerCharacterId"
)
SELECT
  'project',
  'Project petition: ' || "Project"."title",
  'Migrated petition support for project "' || "Project"."title" || '".',
  'open',
  MIN("PetitionSupport"."supporterName"),
  jsonb_build_object('migratedFrom', 'legacy_project_petitions'),
  MIN("PetitionSupport"."createdAt"),
  MIN("PetitionSupport"."createdAt"),
  "Project"."tribeId",
  "PetitionSupport"."projectId",
  MIN("PetitionSupport"."supporterCharacterId")
FROM "PetitionSupport"
JOIN "Project" ON "Project"."id" = "PetitionSupport"."projectId"
GROUP BY
  "Project"."id",
  "Project"."title",
  "Project"."tribeId",
  "PetitionSupport"."projectId";

UPDATE "PetitionSupport"
SET "petitionId" = "Petition"."id"
FROM "Petition"
WHERE "Petition"."projectId" = "PetitionSupport"."projectId"
  AND "Petition"."metadata" ->> 'migratedFrom' = 'legacy_project_petitions';

ALTER TABLE "PetitionSupport" DROP COLUMN "projectId";
ALTER TABLE "PetitionSupport" ALTER COLUMN "petitionId" SET NOT NULL;

ALTER TABLE "Petition" ADD CONSTRAINT "Petition_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_targetTribeId_fkey" FOREIGN KEY ("targetTribeId") REFERENCES "Tribe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_proposerCharacterId_fkey" FOREIGN KEY ("proposerCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PetitionSupport" ADD CONSTRAINT "PetitionSupport_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PetitionSupport" ADD CONSTRAINT "PetitionSupport_supporterCharacterId_fkey" FOREIGN KEY ("supporterCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

DELETE FROM "PetitionSupport" duplicate
USING "PetitionSupport" keeper
WHERE duplicate."petitionId" = keeper."petitionId"
  AND duplicate."supporterName" = keeper."supporterName"
  AND duplicate."id" > keeper."id";

CREATE UNIQUE INDEX "PetitionSupport_petitionId_supporterName_key" ON "PetitionSupport"("petitionId", "supporterName");
