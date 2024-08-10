import { instance } from "../axios";

const request = {
  myStudent: () => {
    return instance.get("/student/mystudent/").then((res) => res.data);
  },

  myCours: (month, year) => {
    return instance
      .get("/signature/mysignature/" + month + "/" + year + "/")
      .then((res) => res.data);
  },

  myCoursByStudent: (month, year, userId) => {
    return instance
      .get("/signature/mysignature/" + month + "/" + year + "/" + userId)
      .then((res) => res.data);
  },

  myCoursById: (signatureId) => {
    return instance.get("/signature/" + signatureId).then((res) => res.data);
  },

  AllSignature: (month, year) => {
    return instance
      .get("/signature/recap/" + month + "/" + year)
      .then((res) => res.data);
  },

  getRecapSignatureByInterval: (start, end) => {
    return instance
      .get("/signature/recap/interval/" + start + "/" + end)
      .then((res) => res.data);
  },

  getRecapDetailByInterval: (start, end) => {
    return instance
      .get("/signature/detail/interval/" + start + "/" + end)
      .then((res) => res.data);
  },

  DetailSignature: (month, year) => {
    return instance
      .get("/signature/detail/" + month + "/" + year)
      .then((res) => res.data);
  },
  AllStudent: () => {
    return instance.get("/student").then((res) => res.data);
  },
  InvisibleStudent: () => {
    return instance.get("/student/invisible").then((res) => res.data);
  },
  AllTeacher: () => {
    return instance.get("/teacher").then((res) => res.data);
  },
  InvisibleTeacher: () => {
    return instance.get("/teacher/visibility").then((res) => res.data);
  },
  getStudentNotTeacher: (id) => {
    return instance.get("/student/" + id).then((res) => res.data);
  },
};

export default request;
