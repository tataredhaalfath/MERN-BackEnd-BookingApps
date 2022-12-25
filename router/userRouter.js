const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/", userController.get);
router.post("/", userController.create);
router.patch("/:id", userController.update);
router.delete("/:id", userController.delete);

module.exports = router;
