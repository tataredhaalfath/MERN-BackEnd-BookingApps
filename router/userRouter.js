const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.get("/", auth, userController.get);
router.post("/", auth, checkRole("admin"), userController.create);
router.patch("/:id", auth, checkRole("admin"), userController.update);
router.delete("/:id", auth, checkRole("admin"), userController.delete);

router.post("/login", userController.logIn);
router.post("/logout", auth, userController.logOut);
router.post("/logout-all", auth, userController.logOutAll);
router.get("/detail", auth, userController.detailUser);

module.exports = router;
