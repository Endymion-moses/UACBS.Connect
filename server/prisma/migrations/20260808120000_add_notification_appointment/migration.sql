ALTER TABLE "Notification" ADD COLUMN "appointmentId" INTEGER;

CREATE INDEX "Notification_appointmentId_idx" ON "Notification"("appointmentId");

ALTER TABLE "Notification"
  ADD CONSTRAINT "Notification_appointmentId_fkey"
  FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
