const express = require("express");
const router = express.Router();
const itemController = require("../controller/itemController");
const { uploadMultiple } = require("../middleware/multer");

router.get("/", uploadMultiple, itemController.get);
router.post("/", uploadMultiple, itemController.create);

module.exports = router;
