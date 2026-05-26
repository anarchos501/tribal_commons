-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_projectId_fkey";

-- DropForeignKey
ALTER TABLE "SupportRequest" DROP CONSTRAINT "SupportRequest_tribeId_fkey";

-- AlterTable
ALTER TABLE "ActivityEvent" ADD COLUMN     "actorCharacterId" INTEGER;

-- AlterTable
ALTER TABLE "CommonsPool" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "commonsPoolId" INTEGER,
ADD COLUMN     "contributorCharacterId" INTEGER,
ADD COLUMN     "supportRequestId" INTEGER,
ALTER COLUMN "projectId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GovernancePreference" ADD COLUMN     "memberCharacterId" INTEGER;

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "characterProfileId" INTEGER;

-- AlterTable
ALTER TABLE "PersonalStanding" ADD COLUMN     "observerCharacterId" INTEGER,
ADD COLUMN     "subjectCharacterId" INTEGER;

-- AlterTable
ALTER TABLE "Petition" ADD COLUMN     "signerCharacterId" INTEGER;

-- AlterTable
ALTER TABLE "SupportRequest" ADD COLUMN     "projectId" INTEGER,
ADD COLUMN     "requesterCharacterId" INTEGER,
ALTER COLUMN "tribeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tribe" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_characterProfileId_fkey" FOREIGN KEY ("characterProfileId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportRequest" ADD CONSTRAINT "SupportRequest_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportRequest" ADD CONSTRAINT "SupportRequest_requesterCharacterId_fkey" FOREIGN KEY ("requesterCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportRequest" ADD CONSTRAINT "SupportRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_signerCharacterId_fkey" FOREIGN KEY ("signerCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_supportRequestId_fkey" FOREIGN KEY ("supportRequestId") REFERENCES "SupportRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_commonsPoolId_fkey" FOREIGN KEY ("commonsPoolId") REFERENCES "CommonsPool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_contributorCharacterId_fkey" FOREIGN KEY ("contributorCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalStanding" ADD CONSTRAINT "PersonalStanding_observerCharacterId_fkey" FOREIGN KEY ("observerCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalStanding" ADD CONSTRAINT "PersonalStanding_subjectCharacterId_fkey" FOREIGN KEY ("subjectCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernanceTopic" ADD CONSTRAINT "GovernanceTopic_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernancePreference" ADD CONSTRAINT "GovernancePreference_memberCharacterId_fkey" FOREIGN KEY ("memberCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FederationRelationship" ADD CONSTRAINT "FederationRelationship_sourceTribeId_fkey" FOREIGN KEY ("sourceTribeId") REFERENCES "Tribe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FederationRelationship" ADD CONSTRAINT "FederationRelationship_targetTribeId_fkey" FOREIGN KEY ("targetTribeId") REFERENCES "Tribe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_actorCharacterId_fkey" FOREIGN KEY ("actorCharacterId") REFERENCES "CharacterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
