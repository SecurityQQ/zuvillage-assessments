/*
  Warnings:

  - You are about to drop the `AssessmentHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AssessmentHistory";

-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "scores" JSONB NOT NULL,
    "answersHistory" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);
