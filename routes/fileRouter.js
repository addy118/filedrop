const { Router } = require("express");
const { getUpload, postUpload } = require("../controllers/fileController");
const fileRouter = Router();

fileRouter.get("/upload", getUpload);
fileRouter.post("/upload", postUpload);

module.exports = fileRouter;
