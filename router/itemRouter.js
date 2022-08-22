const express = require("express");
const router = express.Router();
const itemController = require("../controller/itemController");
const { uploadMultiple } = require("../middleware/multer");

router.get("/", itemController.get);
router.post("/", uploadMultiple, itemController.create);
router.patch("/:id", uploadMultiple, itemController.update);
router.delete("/:id", itemController.delete);

module.exports = router;
