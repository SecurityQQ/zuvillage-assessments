-- CreateTable
CREATE TABLE "Identity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "option1" TEXT NOT NULL,
    "option2" TEXT NOT NULL,
    "option1Scores" JSONB NOT NULL,
    "option2Scores" JSONB NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityQuestion" (
    "id" SERIAL NOT NULL,
    "identityId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "IdentityQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Identity_name_key" ON "Identity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IdentityQuestion_identityId_questionId_key" ON "IdentityQuestion"("identityId", "questionId");

-- AddForeignKey
ALTER TABLE "IdentityQuestion" ADD CONSTRAINT "IdentityQuestion_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityQuestion" ADD CONSTRAINT "IdentityQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
