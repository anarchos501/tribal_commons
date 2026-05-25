-- CreateTable
CREATE TABLE "GovernanceTopic" (
    "id" SERIAL NOT NULL,
    "tribeId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "minLabel" TEXT NOT NULL,
    "maxLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GovernanceTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernancePreference" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "memberName" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernancePreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GovernancePreference_topicId_memberName_key" ON "GovernancePreference"("topicId", "memberName");

-- AddForeignKey
ALTER TABLE "GovernancePreference" ADD CONSTRAINT "GovernancePreference_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "GovernanceTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
