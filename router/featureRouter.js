const express = require("express");
const router = express.Router();
const featureController = require("../controller/FeatureController");
const { uploadSingle } = require("../middleware/multer");

router.get("/", featureController.get);
router.post("/", uploadSingle, featureController.create);
router.patch("/:id", uploadSingle, featureController.update);

module.exports = router;
