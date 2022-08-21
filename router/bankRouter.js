const express = require("express");
const router = express.Router();
const bankController = require("../controller/bankController");
const { uploadSingle } = require("../middleware/multer");

router.post("/", uploadSingle, bankController.create);
router.patch("/:id", uploadSingle, bankController.update);
router.get("/", uploadSingle, bankController.get);

module.exports = router;
