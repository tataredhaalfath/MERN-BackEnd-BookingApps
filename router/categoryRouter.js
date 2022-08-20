const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");

router.post("/", categoryController.addCategory);
router.get("/", categoryController.getCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.destroyCategory);

module.exports = router;
