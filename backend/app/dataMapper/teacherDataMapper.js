const debug = require("debug")("teacherDataMapper");
const dataBase = require("../dataBase");
const ApiError = require("../errors/apiError");

module.exports = {
  newTeacher: async (form) => {
    const query = {
      text: `
      INSERT INTO timesheet_teacher (lastname, firstname, email, password, is_admin)
      VALUES 
      ($1,$2,$3,$4,$5)
      RETURNING *`,
      values: [
        form.lastname,
        form.firstname,
        form.email,
        form.password,
        form.isAdmin,
      ],
    };

    const data = (await dataBase.query(query)).rows[0];
    debug(`> newTeacher()`);
    if (!data) {
      throw new ApiError("No data found for newTeacher()", 404);
    }
    return data;
  },

  getTeacherByEmail: async (email) => {
    const query = {
      text: `SELECT * FROM "timesheet_teacher" WHERE email = $1`,
      values: [email],
    };

    const user = (await dataBase.query(query)).rows[0];

    debug(`> getTeacherByEmail()`);
    // if (!user) {
    //   throw new ApiError("No data found for getTeacherByEmail()", 404);
    // }
    return user;
  },

  getTeacherById: async (id) => {
    const query = {
      text: `select * from timesheet_teacher where id = $1`,
      values: [id],
    };

    const password = (await dataBase.query(query)).rows[0];

    debug(`> getPasswordById()`);
    if (!password) {
      throw new ApiError("No data found for getPasswordById()", 404);
    }
    return password;
  },

  updatePasswordById: async (taecherId, newPassword) => {
    const query = {
      text: `UPDATE timesheet_teacher
      SET 
        password = $1
      WHERE id = $2
      returning *`,
      values: [newPassword, taecherId],
    };

    const password = (await dataBase.query(query)).rows[0];

    debug(`> updatePasswordById()`);
    if (!password) {
      throw new ApiError("No data found for updatePasswordById()", 404);
    }
    return password;
  },

  getAllTeacher: async () => {
    const query = {
      text: `select
      timesheet_teacher.id,
      timesheet_teacher.lastname,
      timesheet_teacher.firstname,
      timesheet_teacher.email,
      timesheet_teacher.is_admin,
      COALESCE(json_agg(json_build_object('id_link',timesheet_teacher_has_student.id,'id',timesheet_student.id,'firstname',timesheet_student.firstname,'lastname',timesheet_student.lastname)) FILTER (WHERE timesheet_student.lastname IS NOT null and timesheet_student.is_visible = true and timesheet_teacher_has_student.is_visible = true ), '[]') AS students
      from timesheet_teacher
      left join timesheet_teacher_has_student on timesheet_teacher.id = timesheet_teacher_has_student.teacher_id 
      left join timesheet_student on timesheet_student.id = timesheet_teacher_has_student.student_id 
      where timesheet_teacher.is_visible = true
      group by timesheet_teacher.id`,
      values: null,
    };

    const allTeacher = (await dataBase.query(query)).rows;

    debug(`> getAllTeacher()`);
    if (!allTeacher) {
      throw new ApiError("No data found for getAllTeacher()", 404);
    }
    return allTeacher;
  },

  getNotVisibilityTeacher: async () => {
    const query = {
      text: `select       
		timesheet_teacher.id,
      timesheet_teacher.lastname,
      timesheet_teacher.firstname,
      timesheet_teacher.is_admin
      from timesheet_teacher where is_visible = false`,
      values: null,
    };

    const allTeacher = (await dataBase.query(query)).rows;

    debug(`> getNotVisibilityTeacher()`);
    if (!allTeacher) {
      throw new ApiError("No data found for getNotVisibilityTeacher()", 404);
    }
    return allTeacher;
  },

  updateTeacher: async (form) => {
    const query = {
      text: `update timesheet_teacher
      SET 
        lastname = $1,
        firstname  = $2,
        email = $3,
        is_admin = $4
      WHERE id = $5
      RETURNING id`,
      values: [
        form.lastname,
        form.firstname,
        form.email,
        form.is_admin,
        form.teacher_id,
      ],
    };

    const allTeacher = (await dataBase.query(query)).rows[0];

    debug(`> updateTeacher()`);
    if (!allTeacher) {
      throw new ApiError("No data found for updateTeacher()", 404);
    }
    return allTeacher;
  },

  updateVisibilityTeacher: async (body) => {
    const query = {
      text: `UPDATE timesheet_teacher SET is_visible = $1 WHERE id = $2 RETURNING id, is_visible`,
      values: [Boolean(body.visibility), body.id],
    };

    const deleteTeacher = (await dataBase.query(query)).rows[0];

    debug(`> updateVisibilityTeacher()`);
    if (!deleteTeacher) {
      throw new ApiError("No data found for updateVisibilityTeacher()", 404);
    }
    return deleteTeacher;
  },

  deleteTeacher: async (id) => {
    // a modifier
    const query = {
      text: `delete from timesheet_teacher where id = $1 RETURNING *`,
      values: [id],
    };

    const deleteTeacher = (await dataBase.query(query)).rows[0];

    debug(`> deleteTeacher()`);
    if (!deleteTeacher) {
      throw new ApiError("No data found for deleteTeacher()", 404);
    }
    return deleteTeacher;
  },

  linkVisible: async (teacherId, studentId) => {
    const query = {
      text: `INSERT INTO timesheet_teacher_has_student (teacher_id, student_id)
      VALUES 
      ($1,$2)
      RETURNING *`,
      values: [teacherId, studentId],
    };

    const student = (await dataBase.query(query)).rows[0];

    debug(`> addStudentAtTeacher()`);
    if (!student) {
      throw new ApiError("No data found for addStudentAtTeacher()", 404);
    }
    return student;
  },

  oneAdmin: async () => {
    const query = {
      text: `select is_admin
      from timesheet_teacher
      where is_admin = true`,
    };

    const admin = (await dataBase.query(query)).rows;

    debug(`> oneAdmin()`);
    if (admin.length > 0) {
      return true;
    }
    return false;
  },

  addStudentAtTeacher: async (teacherId, studentId) => {
    const query = {
      text: `INSERT INTO timesheet_teacher_has_student (teacher_id, student_id)
      VALUES 
      ($1,$2)
      RETURNING *`,
      values: [teacherId, studentId],
    };

    const student = (await dataBase.query(query)).rows[0];

    debug(`> addStudentAtTeacher()`);
    if (!student) {
      throw new ApiError("No data found for addStudentAtTeacher()", 404);
    }
    return student;
  },

  deleteStudentAtTeacher: async (id) => {
    const query = {
      text: `delete from timesheet_teacher_has_student where id = $1 returning *;`,
      values: [id],
    };

    const student = (await dataBase.query(query)).rows[0];

    debug(`> deleteStudentAtTeacher()`);
    if (!student) {
      throw new ApiError("No data found for deleteStudentAtTeacher()", 404);
    }
    return student;
  },
};
