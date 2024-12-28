const { Router } = require("express");
const { getRouter } = require("../controllers/routerController");
require("dotenv").config({ path: "../.env" });

const router = Router();

router.get("/", getRouter);

module.exports = router;
