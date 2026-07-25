-- CreateTable
CREATE TABLE "LecturerAvailability" (
    "id" SERIAL NOT NULL,
    "lecturerId" INTEGER NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LecturerAvailability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LecturerAvailability" ADD CONSTRAINT "LecturerAvailability_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "LecturerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
