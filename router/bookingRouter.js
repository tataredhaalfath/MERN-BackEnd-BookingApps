const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { uploadSingle } = require("../middleware/multer");

router.post("/", uploadSingle, bookingController.create);
router.patch("/:id", uploadSingle, bookingController.reject);
router.delete("/:id", bookingController.delete);
router.get("/", bookingController.get);
router.get("/:id", bookingController.getDetail);

module.exports = router;
