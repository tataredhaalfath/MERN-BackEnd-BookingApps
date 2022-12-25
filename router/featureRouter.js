const express = require("express");
const router = express.Router();
const featureController = require("../controller/FeatureController");
const { uploadSingle } = require("../middleware/multer");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.get("/", auth, featureController.get);
router.post(
  "/",
  auth,
  checkRole("admin"),
  uploadSingle,
  featureController.create
);
router.patch(
  "/:id",
  auth,
  checkRole("admin"),
  uploadSingle,
  featureController.update
);
router.delete("/:id", auth, checkRole("admin"), featureController.delete);

module.exports = router;
