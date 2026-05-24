-- CreateTable
CREATE TABLE "Tribe" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tribe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "tribeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tribeId" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AidRequest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AidRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
