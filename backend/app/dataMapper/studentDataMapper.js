const debug = require("debug")("studentDataMapper");
const dataBase = require("../dataBase");
const ApiError = require("../errors/apiError");

module.exports = {
  getAllStudentByTeacher: async (teacherId) => {
    const query = {
      text: `select
      timesheet_student.id,
      timesheet_student.lastname,
      timesheet_student.firstname
      from timesheet_teacher_has_student
      join timesheet_student on timesheet_teacher_has_student.student_id = timesheet_student.id
      where teacher_id = $1 
      and timesheet_student.is_visible = true and timesheet_teacher_has_student.is_visible = true
      order by timesheet_student.lastname`,
      values: [teacherId],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> getAllStudentByTeacher()`);
    if (!data) {
      throw new ApiError("No data found for getAllStudentByTeacher()", 404);
    }
    return data;
  },

  getAllStudent: async () => {
    const query = {
      text: `select * from timesheet_student where is_visible = true`,
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> getAllStudent()`);
    if (!data) {
      throw new ApiError("No data found for getAllStudent()", 404);
    }
    return data;
  },

  getInvisibleStudent: async () => {
    const query = {
      text: `select * from timesheet_student where is_visible = false`,
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> getInvisibleStudent()`);
    if (!data) {
      throw new ApiError("No data found for getInvisibleStudent()", 404);
    }
    return data;
  },

  getStudentNotTeacher: async (teacherId) => {
    const query = {
      text: `select * 
      from timesheet_student
      where id not IN (
      
      select
      timesheet_student.id as student_id
      from timesheet_teacher_has_student
      join timesheet_teacher on timesheet_teacher.id = timesheet_teacher_has_student.teacher_id 
      join timesheet_student on timesheet_student.id = timesheet_teacher_has_student.student_id
      where timesheet_teacher.id = $1 
      
      ) and timesheet_student.is_visible = true`,
      values: [teacherId],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> getStudentNotTeacher()`);
    if (!data) {
      throw new ApiError("No data found for getStudentNotTeacher()", 404);
    }
    return data;
  },

  postStudent: async (form) => {
    const query = {
      text: `INSERT INTO timesheet_student (lastname, firstname)
      VALUES 
      ($1,$2)
      RETURNING *`,
      values: [form.lastname, form.firstname],
    };

    const data = (await dataBase.query(query)).rows[0];
    debug(`> postStudent()`);
    if (!data) {
      throw new ApiError("No data found for postStudent()", 404);
    }
    return data;
  },

  updateStudent: async (form) => {
    const query = {
      text: `UPDATE timesheet_student
      SET 
        lastname = $2,
        firstname  = $3
      WHERE id = $1
      RETURNING*`,
      values: [form.studentId, form.lastname, form.firstname],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> updateStudent()`);
    if (!data) {
      throw new ApiError("No data found for updateStudent()", 404);
    }
    return data;
  },

  deleteStudent: async (studentId) => {
    const query = {
      text: `delete from timesheet_student where id = $1
      RETURNING *`,
      values: [studentId],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> deleteStudent()`);
    if (!data) {
      throw new ApiError("No data found for deleteStudent()", 404);
    }
    return data;
  },

  updateInvisibleStudent: async (studentId) => {
    const query = {
      text: `UPDATE timesheet_student SET is_visible = FALSE WHERE id = $1
      RETURNING *`,
      values: [studentId],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> updateInvisibleStudent()`);
    if (!data) {
      throw new ApiError("No data found for updateInvisibleStudent()", 404);
    }
    return data;
  },

  updateVisibleStudent: async (studentId) => {
    const query = {
      text: `UPDATE timesheet_student SET is_visible = TRUE WHERE id = $1
      RETURNING *`,
      values: [studentId],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> updateVisibleStudent()`);
    if (!data) {
      throw new ApiError("No data found for updateVisibleStudent()", 404);
    }
    return data;
  },
};
