-- Deploy timesheet:unique to pg

BEGIN;

ALTER TABLE timesheet_teacher_has_student
  ADD CONSTRAINT check_values UNIQUE(teacher_id, student_id);

COMMIT;
