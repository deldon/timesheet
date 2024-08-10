-- Revert timesheet:unique from pg

BEGIN;

ALTER TABLE timesheet_teacher_has_student
  DROP CONSTRAINT check_values ;

COMMIT;
