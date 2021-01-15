-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "vacationId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY("vacationId")REFERENCES "Vacation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
