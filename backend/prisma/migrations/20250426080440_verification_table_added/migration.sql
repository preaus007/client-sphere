/*
  Warnings:

  - You are about to drop the column `verificationToken` on the `Freelancer` table. All the data in the column will be lost.
  - You are about to drop the column `verificationTokenExpiresAt` on the `Freelancer` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "verificationType" AS ENUM ('email_verification', 'password_reset');

-- AlterTable
ALTER TABLE "Freelancer" DROP COLUMN "verificationToken",
DROP COLUMN "verificationTokenExpiresAt";

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "freelancerID" TEXT NOT NULL,
    "type" "verificationType" NOT NULL,
    "verificationToken" TEXT,
    "verificationTokenExpiresAt" TIMESTAMP(3),

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_freelancerID_fkey" FOREIGN KEY ("freelancerID") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
