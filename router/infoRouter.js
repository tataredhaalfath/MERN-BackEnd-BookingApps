const express = require("express");
const router = express.Router();
const infoController = require("../controller/infoController");
const { uploadSingle } = require("../middleware/multer");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.get("/", auth, infoController.get);
router.post("/", auth, checkRole("admin"), uploadSingle, infoController.create);
router.patch(
  "/:id",
  auth,
  checkRole("admin"),
  uploadSingle,
  infoController.update
);
router.delete("/:id", auth, checkRole("admin"), infoController.delete);
module.exports = router;
