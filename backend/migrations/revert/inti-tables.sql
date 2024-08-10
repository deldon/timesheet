-- Revert timesheet:inti-tables from pg

BEGIN;

DROP TABLE IF EXISTS timesheet_teacher_has_student;
DROP TABLE IF EXISTS timesheet_signature;
DROP TABLE IF EXISTS timesheet_student;
DROP TABLE IF EXISTS timesheet_teacher;

COMMIT;
