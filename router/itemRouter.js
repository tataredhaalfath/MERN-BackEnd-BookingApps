const express = require("express");
const imageController = require("../controller/imageController");
const router = express.Router();
const itemController = require("../controller/itemController");
const { uploadMultiple, uploadSingle } = require("../middleware/multer");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.get("/", itemController.get);
router.post(
  "/",
  auth,
  checkRole("admin"),
  uploadMultiple,
  itemController.create
);
router.patch(
  "/:id",
  auth,
  checkRole("admin"),
  uploadMultiple,
  itemController.update
);
router.delete("/:id", auth, checkRole("admin"), itemController.delete);

// image item
router.post(
  "/image/:itemId",
  auth,
  checkRole("admin"),
  uploadSingle,
  imageController.create
);
router.delete(
  "/image/:itemId/:id",
  auth,
  checkRole("admin"),
  imageController.delete
);

module.exports = router;
