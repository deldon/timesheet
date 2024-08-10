const express = require("express");
const teacherController = require("../controllers/teacherController");
const controllerHandler = require("../helpers/controllerHandler");
const token = require("../middleware/security");

const router = express.Router();

router.post("/teacher/login", controllerHandler(teacherController.newLogin));

router.post("/teacher/admin", controllerHandler(teacherController.addAdmin));

//ADMIN
router.post(
  "/teacher/",
  token.secuity("admin"),
  controllerHandler(teacherController.addTeacher)
);

router.patch(
  "/teacher/password",
  token.secuity(),
  controllerHandler(teacherController.updatePassword)
);

router.patch(
  "/teacher",
  token.secuity("admin"),
  controllerHandler(teacherController.updateTeacher)
);

router.get(
  "/teacher",
  token.secuity("admin"),
  controllerHandler(teacherController.getAllTeacher)
);

router.get(
  "/teacher/visibility",
  token.secuity("admin"),
  controllerHandler(teacherController.getNotVisibilityTeacher)
);



router.delete(
  "/teacher/item/:id",
  token.secuity("admin"),
  controllerHandler(teacherController.deleteTeacher)
);

router.patch(
  "/teacher/visibility",
  token.secuity("admin"),
  controllerHandler(teacherController.updateVisibilityTeacher)
);

router.post(
  "/teacher/link",
  token.secuity("admin"),
  controllerHandler(teacherController.addStudentAtTeacher)
);

router.delete(
  "/teacher/link/:id",
  token.secuity("admin"),
  controllerHandler(teacherController.deleteStudentAtTeacher)
);

module.exports = router;
