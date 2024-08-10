const studentDataMapper = require('../dataMapper/studentDataMapper')
const debug = require("debug")("studentController");

module.exports = {

    getAllStudentByTeacher: async (req, res, next) => {
    const teacherid = req.decoded.user.id;

    const myStudents = await studentDataMapper.getAllStudentByTeacher(teacherid)

    debug(" > getAllStudentByTeacher()");
    if (myStudents) {
      res.json(myStudents);
    } else {
      next();
    }
  },

  getAllStudient: async (req,res,next) => {
    const myStudents = await studentDataMapper.getAllStudent()

    debug(" > getAllStudent()");

    if (myStudents) {
      res.json(myStudents);
    } else {
      next();
    }
  },

  getInvisibleStudent: async (req,res,next) => {
    const myStudents = await studentDataMapper.getInvisibleStudent()

    debug(" > getInvisibleStudent()");

    if (myStudents) {
      res.json(myStudents);
    } else {
      next();
    }
  },

  getStudentNotTeacher: async (req,res,next) => {
    const myStudents = await studentDataMapper.getStudentNotTeacher(req.params.id)

    debug(" > getStudentNotTeacher()");

    if (myStudents) {
      res.json(myStudents);
    } else {
      next();
    }
  },

  postStudent: async (req,res,next) => {


    const newStudent = await studentDataMapper.postStudent(req.body)

    debug(" > postStudent()");

    if (newStudent) {
      res.json(newStudent);
    } else {
      next();
    }
  },

  updateStudent: async (req,res,next) => {
    

    const updateStudent = await studentDataMapper.updateStudent(req.body)

    debug(" > updateStudent()");

    if (updateStudent) {
      res.json(updateStudent);
    } else {
      next();
    }
  },

  deleteStudent: async (req,res,next) => {
    

    const deleteStudent = await studentDataMapper.deleteStudent(req.params.id)

    debug(" > deleteStudent()");

    if (deleteStudent) {
      res.json('student number '+ req.params.id +' was deleted');
    } else {
      next();
    }
  },

  updateInvisibleStudent: async (req,res,next) => {
    

    const deleteStudent = await studentDataMapper.updateInvisibleStudent(req.params.id)

    debug(" > updateInvisibleStudent()");

    if (deleteStudent) {
      res.json('student number '+ req.params.id +' was invisible');
    } else {
      next();
    }
  },

  updateVisibleStudent: async (req,res,next) => {
    

    const deleteStudent = await studentDataMapper.updateVisibleStudent(req.params.id)

    debug(" > updateVisibleStudent()");

    if (deleteStudent) {
      res.json('student number '+ req.params.id +' was visible');
    } else {
      next();
    }
  },


};
