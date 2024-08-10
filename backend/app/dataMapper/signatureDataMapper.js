const debug = require("debug")("signatureDataMapper");
const dataBase = require("../dataBase");
const ApiError = require("../errors/apiError");

module.exports = {
  getSignatureByTime: async (teacherid, params) => {
    const query = {
      text: `
            select 
            timesheet_signature.id,
            timesheet_signature.signature_date,
            timesheet_signature.start_time ,
            timesheet_signature.end_time ,
            timesheet_signature.shifting ,
            timesheet_signature.is_absent ,
            (timesheet_signature.end_time - timesheet_signature.start_time) as duration,
            round( CAST(float8 (EXTRACT (HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
            + 
            (EXTRACT (MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time))/60) as numeric), 2)
              as deci_duration,
            timesheet_student.id as student_id,
            timesheet_student.lastname as student_lastname,
            timesheet_student.firstname as student_firstname
            from timesheet_signature
            join timesheet_student on timesheet_student.id = timesheet_signature.student_id
            where teacher_id = $1
            AND (EXTRACT (MONTH FROM timesheet_signature.signature_date))  = $2
            AND (EXTRACT (YEAR FROM timesheet_signature.signature_date))  = $3
            order by timesheet_signature.created_at DESC`,
      values: [teacherid, params.month, params.year],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> getSignatureByTime()`);
    if (!data) {
      throw new ApiError("No data found for getSignatureByTime()", 404);
    }
    return data;
  },

  getSignatureByTimeAndStudentId: async (teacherid, params) => {
    const query = {
      text: `
            select 
            timesheet_signature.id,
            timesheet_signature.signature_date,
            timesheet_signature.start_time ,
            timesheet_signature.end_time ,
            timesheet_signature.shifting ,
            timesheet_signature.is_absent ,
            (timesheet_signature.end_time - timesheet_signature.start_time) as duration,
            round( CAST(float8 (EXTRACT (HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
            + 
            (EXTRACT (MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time))/60) as numeric), 2)
              as deci_duration,
            timesheet_student.id as student_id,
            timesheet_student.lastname as student_lastname,
            timesheet_student.firstname as student_firstname
            from timesheet_signature
            join timesheet_student on timesheet_student.id = timesheet_signature.student_id
            where teacher_id = $1
            AND timesheet_student.id = $4
            AND (EXTRACT (MONTH FROM timesheet_signature.signature_date))  = $2
            AND (EXTRACT (YEAR FROM timesheet_signature.signature_date))  = $3
            order by timesheet_signature.created_at DESC`,
      values: [teacherid, params.month, params.year, params.studentId],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> getSignatureByTimeAndStudentId()`);
    if (!data) {
      throw new ApiError(
        "No data found for getSignatureByTimeAndStudentId()",
        404
      );
    }
    return data;
  },

  newSignature: async (teacherId, form) => {
    const query = {
      text: `
      INSERT INTO timesheet_signature 
      (teacher_id, student_id, signature_date, start_time, end_time, shifting,is_absent)
      VALUES 
      ($1,$2,$3,$4,$5,$6,$7)
      returning *`,
      values: [
        teacherId,
        form.student_id,
        form.signature_date,
        form.start_time,
        form.end_time,
        form.shifting,
        form.is_absent,
      ],
    };

    const data = (await dataBase.query(query)).rows[0];
    debug(`> newSignature()`);
    if (!data) {
      throw new ApiError("No data found for newSignature()", 404);
    }
    return data;
  },

  updateSignature: async (form) => {
    const query = {
      text: `
      UPDATE timesheet_signature
      SET 
      signature_date = $1,
      start_time = $2,
      end_time = $3,
      shifting = $4,
      is_absent = $5
      WHERE id = $6
      returning *`,
      values: [
        form.signature_date,
        form.start_time,
        form.end_time,
        form.shifting,
        form.is_absent,
        form.id,
      ],
    };

    const data = (await dataBase.query(query)).rows[0];
    debug(`> updateSignature()`);
    if (!data) {
      throw new ApiError("No data found for updateSignature()", 404);
    }
    return data;
  },

  getSignatureById: async (Id) => {
    const query = {
      text: `select * from timesheet_signature where id = $1`,
      values: [Id],
    };

    const data = (await dataBase.query(query)).rows[0];
    debug(`> getSignatureById()`);
    if (!data) {
      throw new ApiError("No data found for getSignatureById()", 404);
    }
    return data;
  },

  deleteSignature: async (Id) => {
    const query = {
      text: `delete from timesheet_signature where id = $1 returning *;`,
      values: [Id],
    };

    const data = (await dataBase.query(query)).rows[0];
    debug(`> deleteSignature()`);
    if (!data) {
      throw new ApiError("No data found for deleteSignature()", 404);
    }
    return data;
  },

  getRecapSignature: async (month, year) => {
    const query = {
      text: `select 
      timesheet_student.lastname as student_lastname,
      timesheet_student.firstname as student_firstname,
      timesheet_teacher.lastname as teacher_lastname,
      timesheet_teacher.firstname as teacher_firstname,
      count(*) as intervention,
      count(CASE WHEN timesheet_signature.shifting THEN 1 END) as deplacement,
      count(CASE WHEN timesheet_signature.is_absent THEN 1 END) as is_absent,
      sum((timesheet_signature.end_time - timesheet_signature.start_time)) as duration,
      sum(
        round( 
          CAST(
            float8 (EXTRACT (HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
                + 
                 (EXTRACT (MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time))/60) as numeric
             ), 2
           )
        )
      as deci_duration
      from timesheet_signature
      join timesheet_student on timesheet_student.id = timesheet_signature.student_id
      join timesheet_teacher on timesheet_teacher.id = timesheet_signature.teacher_id
      AND (EXTRACT (MONTH FROM timesheet_signature.signature_date))  = $1
      AND (EXTRACT (YEAR FROM timesheet_signature.signature_date))  = $2
      GROUP BY timesheet_student.id , timesheet_teacher.id`,
      values: [month, year],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> getRecapSignature()`);
    if (!data) {
      throw new ApiError("No data found for getRecapSignature()", 404);
    }
    return data;
  },

  getRecapSignatureByInterval: async (start, end) => {
    const query = {
      text: `SELECT 
      timesheet_student.lastname AS student_lastname,
      timesheet_student.firstname AS student_firstname,
      timesheet_teacher.lastname AS teacher_lastname,
      timesheet_teacher.firstname AS teacher_firstname,
      COUNT(*) AS intervention,
      COUNT(CASE WHEN timesheet_signature.shifting THEN 1 END) AS deplacement,
      count(CASE WHEN timesheet_signature.is_absent THEN 1 END) as is_absent,
      SUM(timesheet_signature.end_time - timesheet_signature.start_time) AS duration,
      SUM(
        ROUND( 
          CAST(
            float8 (EXTRACT(HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
            + (EXTRACT(MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time)) / 60) AS numeric
          ), 2
        )
      ) AS deci_duration
    FROM timesheet_signature
    JOIN timesheet_student ON timesheet_student.id = timesheet_signature.student_id
    JOIN timesheet_teacher ON timesheet_teacher.id = timesheet_signature.teacher_id
    WHERE timesheet_signature.signature_date >= $1
      AND timesheet_signature.signature_date <= $2
    GROUP BY timesheet_student.id, timesheet_teacher.id;`,
      values: [start, end],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> getRecapSignature()`);
    if (!data) {
      throw new ApiError("No data found for getRecapSignatureInterval()", 404);
    }
    return data;
  },

  getDetailSignature: async (month, year) => {
    const query = {
      text: `select 
      timesheet_signature.id,
      timesheet_student.lastname as student_lastname,
      timesheet_student.firstname as student_firstname,
      timesheet_teacher.lastname as teacher_lastname,
      timesheet_teacher.firstname as teacher_firstname,
      timesheet_signature.signature_date,
      timesheet_signature.start_time ,
      timesheet_signature.end_time ,
      timesheet_signature.shifting ,
      timesheet_signature.is_absent ,
      (timesheet_signature.end_time - timesheet_signature.start_time) as duration,
      
        round( 
          CAST(
            float8 (EXTRACT (HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
                + 
                 (EXTRACT (MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time))/60) as numeric
             ), 2
           )
      as deci_duration
      from timesheet_signature
      join timesheet_student on timesheet_student.id = timesheet_signature.student_id
      join timesheet_teacher on timesheet_teacher.id = timesheet_signature.teacher_id
      AND (EXTRACT (MONTH FROM timesheet_signature.signature_date))  = $1
      AND (EXTRACT (YEAR FROM timesheet_signature.signature_date))  = $2`,
      values: [month, year],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> getDetailSignature()`);
    if (!data) {
      throw new ApiError("No data found for getDetailSignature()", 404);
    }
    return data;
  },

  getDetailSignatureByInterval: async (start, end) => {
    const query = {
      text: `select 
      timesheet_signature.id,
      timesheet_student.lastname as student_lastname,
      timesheet_student.firstname as student_firstname,
      timesheet_teacher.lastname as teacher_lastname,
      timesheet_teacher.firstname as teacher_firstname,
      timesheet_signature.signature_date,
      timesheet_signature.start_time ,
      timesheet_signature.end_time ,
      timesheet_signature.shifting ,
      timesheet_signature.is_absent ,
      (timesheet_signature.end_time - timesheet_signature.start_time) as duration,
      
        round( 
          CAST(
            float8 (EXTRACT (HOUR FROM (timesheet_signature.end_time - timesheet_signature.start_time))) 
                + 
                 (EXTRACT (MINUTE FROM (timesheet_signature.end_time - timesheet_signature.start_time))/60) as numeric
             ), 2
           )
      as deci_duration
      from timesheet_signature
      join timesheet_student on timesheet_student.id = timesheet_signature.student_id
      join timesheet_teacher on timesheet_teacher.id = timesheet_signature.teacher_id
      WHERE timesheet_signature.signature_date >= $1
      AND timesheet_signature.signature_date <= $2`,
      values: [start, end],
    };

    const data = (await dataBase.query(query)).rows;
    debug(`> getDetailSignatureByInterval()`);
    if (!data) {
      throw new ApiError("No data found for getDetailSignatureByInterval()", 404);
    }
    return data;
  },
};
