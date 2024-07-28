-- CreateTable
CREATE TABLE "AssessmentHistory" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentHistory_pkey" PRIMARY KEY ("id")
);
