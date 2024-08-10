-- Deploy timesheet:inti-tables to pg

BEGIN;

CREATE TABLE "timesheet_teacher" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lastname TEXT NOT NULL,
    firstname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_admin BOOLEAN,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "timesheet_student" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lastname TEXT NOT NULL,
    firstname TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "timesheet_signature" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    teacher_id INT REFERENCES timesheet_teacher(id) ON DELETE CASCADE NOT NULL,
    student_id INT REFERENCES timesheet_student(id) ON DELETE CASCADE NOT NULL,
    signature_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    shifting BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "timesheet_teacher_has_student" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    teacher_id INT REFERENCES timesheet_teacher(id) ON DELETE CASCADE NOT NULL,
    student_id INT REFERENCES timesheet_student(id) ON DELETE CASCADE NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
