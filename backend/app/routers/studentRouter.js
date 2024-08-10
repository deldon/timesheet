const express = require("express");
const controllerHandler = require("../helpers/controllerHandler");
const token = require("../middleware/security");
const studentController = require("../controllers/studentController");

const router = express.Router();

router.get(
  "/student/mystudent/",
  token.secuity(),
  controllerHandler(studentController.getAllStudentByTeacher)
);

router.get(
  "/student",
  token.secuity('admin'),
  controllerHandler(studentController.getAllStudient)
);

router.get(
  "/student/invisible",
  token.secuity('admin'),
  controllerHandler(studentController.getInvisibleStudent)
);

router.get(
  "/student/:id",
  token.secuity('admin'),
  controllerHandler(studentController.getStudentNotTeacher)
);

router.post(
  "/student",
  token.secuity('admin'),
  controllerHandler(studentController.postStudent)
);

router.patch(
  "/student",
  token.secuity('admin'),
  controllerHandler(studentController.updateStudent)
);

router.patch(
  "/student/invisible/:id",
  token.secuity('admin'),
  controllerHandler(studentController.updateInvisibleStudent)
);

router.patch(
  "/student/visible/:id",
  token.secuity('admin'),
  controllerHandler(studentController.updateVisibleStudent)
);

router.delete(
  "/student/:id",
  token.secuity('admin'),
  controllerHandler(studentController.deleteStudent)
);
module.exports = router;
