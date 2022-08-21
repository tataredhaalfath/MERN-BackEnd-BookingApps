const express = require("express");
const router = express.Router();
const bankController = require("../controller/bankController");
const { uploadSingle } = require("../middleware/multer");

router.post("/", uploadSingle, bankController.addBank);

module.exports = router;
