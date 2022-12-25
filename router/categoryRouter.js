const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.post("/", auth, checkRole("admin"), categoryController.create);
router.get("/", auth, categoryController.get);
router.patch("/:id", auth, checkRole("admin"), categoryController.update);
router.delete("/:id", auth, checkRole("admin"), categoryController.delete);

module.exports = router;
