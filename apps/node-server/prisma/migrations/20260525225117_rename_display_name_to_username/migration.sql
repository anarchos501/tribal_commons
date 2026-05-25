/*
  Warnings:

  - You are about to drop the column `displayName` on the `UserAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `UserAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `UserAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAccount" DROP COLUMN "displayName",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_username_key" ON "UserAccount"("username");
