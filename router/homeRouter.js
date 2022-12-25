const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController");

router.get("/",homeController.homePage);
router.get("/item/:id",homeController.detailPage);

module.exports = router;
