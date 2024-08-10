import { instance } from "../axios";

const request = {
  //Signature
  newSignature: (newTodo) => {
    return instance.post("/signature/", newTodo);
  },
  updateSignature: (newTodo) => {
    return instance.patch("/signature/", newTodo);
  },
  deleteSignature: (newTodo) => {
    return instance.delete("/signature/" + newTodo);
  },

  //Student
  newStudent: (newTodo) => {
    return instance.post("/student/", newTodo);
  },
  invisibleStudent: (newTodo) => {
    return instance.patch("/student/invisible/" + newTodo);
  },
  visibleStudent: (newTodo) => {
    return instance.patch("/student/visible/" + newTodo);
  },
  updateStudent: (newTodo) => {
    return instance.patch("/student/", newTodo);
  },
  deleteStudent: (newTodo) => {
    return instance.delete("/student/" + newTodo);
  },

  //Teacher
  updatePassword: (newTodo) => {
    return instance.patch("/teacher/password", newTodo);
  },
  newTeacher: (newTodo) => {
    return instance.post("/teacher/", newTodo);
  },
  login: (newTodo) => {
    return instance.post("/teacher/login/", newTodo);
  },
  DeleteTeacher: (newTodo) => {
    return instance.delete("/teacher/item/" + newTodo);
  },
  updateTeacher: (newTodo) => {
    return instance.patch("/teacher/", newTodo);
  },
  visibilityTeacher: (newTodo) => {
    return instance.patch("/teacher/visibility", newTodo);
  },
  AddStudentToTeacher: (newTodo) => {
    return instance.post("/teacher/link", newTodo);
  },
  DeleteStudentToTeacher: (newTodo) => {
    return instance.delete("/teacher/link/" + newTodo);
  },
};

export default request;
