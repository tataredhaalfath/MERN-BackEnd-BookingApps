const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");

router.post("/", categoryController.create);
router.get("/", categoryController.get);
router.patch("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

module.exports = router;
