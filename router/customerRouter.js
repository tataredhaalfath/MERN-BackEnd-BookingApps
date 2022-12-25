const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.post("/", auth, checkRole("admin"), customerController.create);
router.get("/", auth, customerController.get);
router.patch("/:id", auth, checkRole("admin"), customerController.update);
router.delete("/:id", auth, checkRole("admin"), customerController.delete);

module.exports = router;
