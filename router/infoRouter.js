const express = require("express");
const router = express.Router();
const infoController = require("../controller/infoController");
const { uploadSingle } = require("../middleware/multer");

router.get("/", infoController.get);
router.post("/", uploadSingle, infoController.create);
router.patch("/:id", uploadSingle, infoController.update);
module.exports = router;
