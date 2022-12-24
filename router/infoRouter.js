const express = require("express");
const router = express.Router();
const infoController = require("../controller/infoController");
const { uploadSingle } = require("../middleware/multer");

router.get("/", infoController.get);
router.post("/", uploadSingle, infoController.create);

module.exports = router;
