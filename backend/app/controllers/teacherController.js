const teacherDataMapper = require("../dataMapper/teacherDataMapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const debug = require("debug")("teacherController");

module.exports = {
  addTeacher: async (req, res, next) => {
    const user = await teacherDataMapper.getTeacherByEmail(req.body.email);

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(req.body.password, salt);

      const form = {
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        password: encryptedPassword,
        isAdmin: req.body.isAdmin,
      };

      const newUser = await teacherDataMapper.newTeacher(form);
      if (newUser) {
        debug(`> addTeacher()`);
        delete newUser.password;
        res.json(newUser);
      } else {
        next();
      }
    } else {
      res.status(400).json({ error: "email is already in use" });
    }
  },

  addAdmin: async (req, res, next) => {
    const oneAdmin = await teacherDataMapper.oneAdmin();
    const user = await teacherDataMapper.getTeacherByEmail(req.body.email);

    if (!user) {
      if (!oneAdmin) {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);

        const form = {
          lastname: req.body.lastname,
          firstname: req.body.firstname,
          email: req.body.email,
          password: encryptedPassword,
          isAdmin: true,
        };

        const newUser = await teacherDataMapper.newTeacher(form);
        if (newUser) {
          debug(`> addAdmin()`);
          delete newUser.password;
          res.json(newUser);
        } else {
          next();
        }
      } else {
        res.status(400).json({ error: "Admin is exist" });
      }
    } else {
      res.status(400).json({ error: "email is already in use" });
    }

    res.json("coucou");
  },

  newLogin: async (req, res, next) => {
    const user = await teacherDataMapper.getTeacherByEmail(req.body.email);

    if (user) {
      const validPwd = await bcrypt.compare(req.body.password, user.password);
      if (!validPwd) {
        return res.status(404).json({
          error: "This is not the correct password",
        });
      }
      delete user.password;

      const expireIn = 24 * 60 * 60;
      const token = jwt.sign(
        {
          user: user,
        },
        SECRET_KEY,
        {
          expiresIn: expireIn,
        }
      );

      res.header("Authorization", "Bearer " + token);

      debug(`> newLogin()`);
      return res.status(200).json({
        logged: true,
        user,
      });
    } else {
      return res.status(404).json({
        error: "This is the wrong login",
      });
    }
  },

  updatePassword: async (req, res, next) => {
    const teacher = await teacherDataMapper.getTeacherById(req.decoded.user.id);

    const validPwd = await bcrypt.compare(
      req.body.oldPassword,
      teacher.password
    );
    if (!validPwd) {
      return res.status(404).json({
        error: "This is not the correct password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(req.body.newPassword, salt);

    const passwordUpdated = await teacherDataMapper.updatePasswordById(
      teacher.id,
      encryptedPassword
    );

    if (passwordUpdated) {
      debug(`> updatePassword()`);

      res.json("the password has been changed");
    } else {
      next();
    }
  },

  getAllTeacher: async (req, res, next) => {
    const allTeacher = await teacherDataMapper.getAllTeacher();

    debug(" > getAllTeacher()");

    if (allTeacher) {
      res.json(allTeacher);
    } else {
      next();
    }
  },

  getNotVisibilityTeacher: async (req, res, next) => {
    const allTeacher = await teacherDataMapper.getNotVisibilityTeacher();

    debug(" > getNotVisibilityTeacher()");

    if (allTeacher) {
      res.json(allTeacher);
    } else {
      next();
    }
  },

  updateTeacher: async (req, res, next) => {
    const teacherUpdated = await teacherDataMapper.updateTeacher(req.body);
    if (teacherUpdated) {
      debug(`> updateTeacher()`);

      res.json(teacherUpdated);
    } else {
      next();
    }
  },

  updateVisibilityTeacher: async (req, res, next) => {
    const teacher = await teacherDataMapper.updateVisibilityTeacher(req.body);

    if (teacher) {
      debug(`> updateVisibilityTeacher()`);

      res.json(teacher);
    } else {
      next();
    }
  },

  deleteTeacher: async (req, res, next) => {
    const userId = req.params.id;

    const teacher = await teacherDataMapper.getTeacherById(userId);

    if (teacher.is_admin) {
      res.status(404).json({
        error: "you cannot delete an admin",
      });
    } else {
      const teacherDeleted = await teacherDataMapper.deleteTeacher(userId);

      if (teacherDeleted) {
        debug(`> teacherDeleted()`);

        res.json(teacherDeleted);
      } else {
        next();
      }
    }
  },

  addStudentAtTeacher: async (req, res, next) => {
    const teacherLinkAdd = await teacherDataMapper.addStudentAtTeacher(
      req.body.teacher_id,
      req.body.student_id
    );

    if (teacherLinkAdd) {
      debug(`> addStudentAtTeacher()`);

      res.json(teacherLinkAdd);
    } else {
      next();
    }
  },

  deleteStudentAtTeacher: async (req, res, next) => {
    const teacherLinkDelete = await teacherDataMapper.deleteStudentAtTeacher(
      req.params.id
    );
    if (teacherLinkDelete) {
      debug(`> deleteStudentAtTeacher()`);

      res.json(teacherLinkDelete);
    } else {
      next();
    }
  },
};
