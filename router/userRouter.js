const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const auth = require("../middleware/auth");

router.get("/", userController.get);
router.post("/", userController.create);
router.patch("/:id", userController.update);
router.delete("/:id", userController.delete);

router.post("/login", userController.logIn);
router.post("/logout", auth, userController.logOut);
router.post("/logout-all", auth, userController.logOutAll);

module.exports = router;
