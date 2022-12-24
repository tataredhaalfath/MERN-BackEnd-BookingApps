const express = require("express");
const imageController = require("../controller/imageController");
const router = express.Router();
const itemController = require("../controller/itemController");
const { uploadMultiple, uploadSingle } = require("../middleware/multer");

router.get("/", itemController.get);
router.post("/", uploadMultiple, itemController.create);
router.patch("/:id", uploadMultiple, itemController.update);
router.delete("/:id", itemController.delete);

// image item
router.post("/image/:itemId", uploadSingle, imageController.create);
router.delete("/image/:itemId/:id", imageController.delete);

module.exports = router;
