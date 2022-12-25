const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { uploadSingle } = require("../middleware/multer");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.post("/", uploadSingle, bookingController.create);
router.put(
  "/reject/:id",
  auth,
  checkRole("admin"),
  uploadSingle,
  bookingController.reject
);
router.put(
  "/accept/:id",
  auth,
  checkRole("admin"),
  uploadSingle,
  bookingController.accept
);
router.delete("/:id", auth, checkRole("admin"), bookingController.delete);
router.get("/", auth, bookingController.get);
router.get("/:id", auth, bookingController.getDetail);

module.exports = router;
