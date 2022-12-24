const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");

router.post("/", customerController.create);
router.get("/", customerController.get);
router.patch("/:id", customerController.update);
router.delete("/:id", customerController.delete);

module.exports = router;
