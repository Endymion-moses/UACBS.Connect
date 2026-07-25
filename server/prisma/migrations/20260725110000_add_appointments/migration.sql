-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "lecturerId" INTEGER NOT NULL,
    "appointmentDate" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_lecturerId_appointmentDate_timeSlot_key" ON "Appointment"("lecturerId", "appointmentDate", "timeSlot");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "LecturerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
