const express = require("express");
const controllerHandler = require("../helpers/controllerHandler");
const token = require("../middleware/security");
const signatureController = require("../controllers/signatureController");

const router = express.Router();

//MAIN
// router.get('/main/', token.secuity ,controllerHandler(mainController.helloWord));
router.get(
  "/signature/mysignature/:month/:year/",
  token.secuity(),
  controllerHandler(signatureController.getSignatureByTime)
);

router.get(
  "/signature/mysignature/:month/:year/:studentId",
  token.secuity(),
  controllerHandler(signatureController.getSignatureByTimeAndStudentId)
);

router.post(
  "/signature/",
  token.secuity(),
  controllerHandler(signatureController.newSignature)
);

router.patch(
  "/signature/",
  token.secuity(),
  controllerHandler(signatureController.updateSignature)
);

router.get(
  "/signature/:id",
  token.secuity(),
  controllerHandler(signatureController.getSignatureById)
);

router.delete(
  "/signature/:id",
  token.secuity(),
  controllerHandler(signatureController.deleteSignature)
);

// ADMIN
router.get(
  "/signature/recap/:month/:year",
  token.secuity('admin'),
  controllerHandler(signatureController.getRecapSignature)
);

router.get(
  "/signature/recap/interval/:start/:end",
  token.secuity('admin'),
  controllerHandler(signatureController.getRecapSignatureByInterval)
);

router.get(
  "/signature/detail/:month/:year",
  token.secuity('admin'),
  controllerHandler(signatureController.getDetailSignature)
);

router.get(
  "/signature/detail/interval/:start/:end",
  token.secuity('admin'),
  controllerHandler(signatureController.getDetailSignatureByInterval)
);
module.exports = router;
