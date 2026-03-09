-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED');

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'APPLIED',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" JSONB,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobApplicationToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_JobApplicationToTag_AB_unique" ON "_JobApplicationToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_JobApplicationToTag_B_index" ON "_JobApplicationToTag"("B");

-- AddForeignKey
ALTER TABLE "_JobApplicationToTag" ADD CONSTRAINT "_JobApplicationToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationToTag" ADD CONSTRAINT "_JobApplicationToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
