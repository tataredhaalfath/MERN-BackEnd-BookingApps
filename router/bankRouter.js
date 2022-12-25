const express = require("express");
const router = express.Router();
const bankController = require("../controller/bankController");
const { uploadSingle } = require("../middleware/multer");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.post("/", auth, checkRole("admin"), uploadSingle, bankController.create);
router.patch(
  "/:id",
  auth,
  checkRole("admin"),
  uploadSingle,
  bankController.update
);
router.delete("/:id", auth, checkRole("admin"), bankController.delete);
router.get("/", auth, bankController.get);

module.exports = router;
