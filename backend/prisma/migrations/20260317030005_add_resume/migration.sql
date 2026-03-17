-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_userId_fkey";

-- DropIndex
DROP INDEX "Job_applicationDate_idx";

-- DropIndex
DROP INDEX "Job_status_idx";

-- DropIndex
DROP INDEX "Job_userId_applicationDate_idx";

-- DropIndex
DROP INDEX "Job_userId_idx";

-- DropIndex
DROP INDEX "Job_userId_status_idx";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "resumeUrl" TEXT,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "priority" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
