const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { uploadSingle } = require("../middleware/multer");

router.post("/", uploadSingle, bookingController.create);
router.patch("/:id", uploadSingle, bookingController.update);
router.delete("/:id", bookingController.delete);
router.get("/", bookingController.get);

module.exports = router;
