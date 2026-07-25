-- Prevent duplicate availability rows for the same lecturer and weekly time slot.
CREATE UNIQUE INDEX "LecturerAvailability_lecturerId_dayOfWeek_timeSlot_key"
ON "LecturerAvailability"("lecturerId", "dayOfWeek", "timeSlot");
