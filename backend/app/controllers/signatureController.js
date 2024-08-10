const signatureDataMapper = require("../dataMapper/signatureDataMapper");
const dayjs = require("dayjs");

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
dayjs.locale("fr");
const debug = require("debug")("signatureController");

module.exports = {
  getSignatureByTime: async (req, res, next) => {
    const teacherid = req.decoded.user.id;
    const signatures = await signatureDataMapper.getSignatureByTime(
      teacherid,
      req.params
    );

    const total = {
      nbSignature: signatures.length,
      hoursDeci: 0,
      shifting: 0,
    };

    signatures.forEach((element) => {
      if (element.shifting) {
        total.shifting++;
      }

      total.hoursDeci = total.hoursDeci + Number(element.deci_duration);
    });

    debug(" > getSignatureByTime()");
    if (signatures) {
      res.json({ data: signatures, total });
    } else {
      next();
    }
  },

  getSignatureByTimeAndStudentId: async (req, res, next) => {
    const teacherid = req.decoded.user.id;
    const signatures = await signatureDataMapper.getSignatureByTimeAndStudentId(
      teacherid,
      req.params
    );

    const total = {
      nbSignature: signatures.length,
      hoursDeci: 0,
      shifting: 0,
    };

    signatures.forEach((element) => {
      if (element.shifting) {
        total.shifting++;
      }

      total.hoursDeci = total.hoursDeci + Number(element.deci_duration);
    });

    debug(" > getSignatureByTimeAndStudentId()");
    if (signatures) {
      res.json({ data: signatures, total });
    } else {
      next();
    }
  },

  newSignature: async (req, res, next) => {
    const teacherid = req.decoded.user.id;

    const start = dayjs(req.body.start_time, "hh:mm", "en");
    const end = dayjs(req.body.end_time, "hh:mm", "en");

    if (start.isAfter(end)) {
      res.status(400).json({ error: "the start time is with the end time" });
    }

    const newSignature = await signatureDataMapper.newSignature(
      teacherid,
      req.body
    );

    debug(" > newSignature()");
    if (newSignature) {
      res.json(newSignature);
    } else {
      next();
    }
  },

  updateSignature: async (req, res, next) => {
    const teacherid = req.decoded.user.id;
    const isAdmin = req.decoded.user.is_admin;

    const teacherForSignature = await signatureDataMapper.getSignatureById(
      req.body.id
    );

    if (!isAdmin) {
      if (teacherid != teacherForSignature.teacher_id) {
        res.status(400).json({ error: "you were not the editor" });
      }
    }
    const signatureUpdated = await signatureDataMapper.updateSignature(
      req.body
    );

    debug(" > updateSignature()");
    if (signatureUpdated) {
      res.json(signatureUpdated);
    } else {
      next();
    }
  },

  getSignatureById: async (req, res, next) => {
    const teacherid = req.decoded.user.id;
    const isAdmin = req.decoded.user.is_admin;

    const teacherForSignature = await signatureDataMapper.getSignatureById(
      req.params.id
    );
    if (!isAdmin) {
      if (teacherid != teacherForSignature.teacher_id) {
        res.status(400).json({ error: "you were not the editor" });
      }
    }
    debug(" > getSignatureById()");
    if (teacherForSignature) {
      res.json(teacherForSignature);
    } else {
      next();
    }
  },

  deleteSignature: async (req, res, next) => {
    const teacherid = req.decoded.user.id;
    const isAdmin = req.decoded.user.is_admin;

    const teacherForSignature = await signatureDataMapper.getSignatureById(
      req.params.id
    );
    if (!isAdmin) {
      if (teacherid != teacherForSignature.teacher_id) {
        res.status(400).json({ error: "you were not the editor" });
      }
    }
    const signatureDeleted = await signatureDataMapper.deleteSignature(
      req.params.id
    );

    debug(" > signatureDeleted()");
    if (signatureDeleted) {
      res.json(signatureDeleted);
    } else {
      next();
    }
  },

  getRecapSignature: async (req, res, next) => {
    // const teacherid = req.decoded.user.id;
    const params = req.params;

    const recap = await signatureDataMapper.getRecapSignature(
      params.month,
      params.year
    );

    recap.map((e) => {
      let times = "";
      if (e.duration.minutes) {
        times = e.duration.minutes;
      }
      if (e.duration.hours) {
        times = e.duration.hours + "h" + times;
      }
      e.duration = times;

      e.student = e.student_lastname + " " + e.student_firstname;

      e.teacher = e.teacher_lastname + " " + e.teacher_firstname;

      delete e.student_lastname;
      delete e.student_firstname;

      delete e.teacher_lastname;
      delete e.teacher_firstname;

      return e;
    });

    debug(" > getRecapSignature()");
    if (recap) {
      res.json(recap);
    } else {
      next();
    }
  },

  getRecapSignatureByInterval: async (req, res, next) => {
    // const teacherid = req.decoded.user.id;
    const params = req.params;

    const recap = await signatureDataMapper.getRecapSignatureByInterval(
      params.start,
      params.end
    );

    recap.map((e) => {
      let times = "";
      if (e.duration.minutes) {
        times = e.duration.minutes;
      }
      if (e.duration.hours) {
        times = e.duration.hours + "h" + times;
      }
      e.duration = times;

      e.student = e.student_lastname + " " + e.student_firstname;

      e.teacher = e.teacher_lastname + " " + e.teacher_firstname;

      delete e.student_lastname;
      delete e.student_firstname;

      delete e.teacher_lastname;
      delete e.teacher_firstname;

      return e;
    });

    debug(" > getRecapSignatureInterval()");
    if (recap) {
      res.json(recap);
    } else {
      next();
    }
  },

  getDetailSignature: async (req, res, next) => {
    // const teacherid = req.decoded.user.id;
    const params = req.params;

    const recap = await signatureDataMapper.getDetailSignature(
      params.month,
      params.year
    );

    recap.map((e) => {
      let times = "";
      if (e.duration.minutes) {
        times = e.duration.minutes;
      }
      if (e.duration.hours) {
        times = e.duration.hours + "h" + times;
      }
      e.duration = times;

      e.signature_date = dayjs(e.signature_date).format("DD/MM");

      e.student = e.student_lastname + " " + e.student_firstname;

      e.teacher = e.teacher_lastname + " " + e.teacher_firstname;

      delete e.student_lastname;
      delete e.student_firstname;

      delete e.teacher_lastname;
      delete e.teacher_firstname;

      e.start_time = e.start_time.substring(0, 5).replace(":", "h");
      e.end_time = e.end_time.substring(0, 5).replace(":", "h");

      return e;
    });

    debug(" > getDetailSignature()");
    if (recap) {
      res.json(recap);
    } else {
      next();
    }
  },

  getDetailSignatureByInterval: async (req, res, next) => {
    // const teacherid = req.decoded.user.id;
    const params = req.params;

    const recap = await signatureDataMapper.getDetailSignatureByInterval(
      params.start,
      params.end
    );

    recap.map((e) => {
      let times = "";
      if (e.duration.minutes) {
        times = e.duration.minutes;
      }
      if (e.duration.hours) {
        times = e.duration.hours + "h" + times;
      }
      e.duration = times;

      e.signature_date = dayjs(e.signature_date).format("DD/MM/YYYY");

      e.student = e.student_lastname + " " + e.student_firstname;

      e.teacher = e.teacher_lastname + " " + e.teacher_firstname;

      delete e.student_lastname;
      delete e.student_firstname;

      delete e.teacher_lastname;
      delete e.teacher_firstname;

      e.start_time = e.start_time.substring(0, 5).replace(":", "h");
      e.end_time = e.end_time.substring(0, 5).replace(":", "h");

      return e;
    });

    debug(" > getDetailSignatureByInterval()");
    if (recap) {
      res.json(recap);
    } else {
      next();
    }
  },
};
