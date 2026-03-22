/*
  Warnings:

  - Added the required column `status` to the `EmailLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `EmailLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EmailLog_jobId_idx";

-- DropIndex
DROP INDEX "EmailLog_userId_idx";

-- AlterTable
ALTER TABLE "EmailLog" ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
