/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('WISHLIST', 'APPLIED', 'OA', 'INTERVIEWING', 'OFFER', 'REJECTED', 'WITHDRAWN', 'GHOSTED');

-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('RECRUITER_SCREEN', 'PHONE_SCREEN', 'TECHNICAL', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'ONSITE', 'FINAL');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'COMPLETED', 'MISSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "source" TEXT,
    "jobPostUrl" TEXT,
    "appliedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineAssessment" (
    "id" TEXT NOT NULL,
    "platform" TEXT,
    "link" TEXT,
    "assignedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3) NOT NULL,
    "durationMins" INTEGER,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "notes" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "OnlineAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "type" "InterviewType" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMins" INTEGER,
    "location" TEXT,
    "interviewer" TEXT,
    "round" INTEGER,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "notes" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruiterCall" (
    "id" TEXT NOT NULL,
    "recruiter" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMins" INTEGER,
    "phoneOrLink" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "notes" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "RecruiterCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "notes" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineAssessment" ADD CONSTRAINT "OnlineAssessment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruiterCall" ADD CONSTRAINT "RecruiterCall_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
