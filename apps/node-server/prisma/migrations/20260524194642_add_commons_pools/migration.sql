-- CreateTable
CREATE TABLE "CommonsPool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tribeId" INTEGER NOT NULL,

    CONSTRAINT "CommonsPool_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommonsPool" ADD CONSTRAINT "CommonsPool_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
