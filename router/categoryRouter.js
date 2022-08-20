const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");

router.post("/create", categoryController.addCategory);

module.exports = router;
