const { Router } = require("express");
const {
  getUpload,
  postUpload,
  postDeleteFile,
} = require("../controllers/fileController");
const fileRouter = Router();

fileRouter.get("/upload", getUpload);
fileRouter.post("/upload", postUpload);

fileRouter.post("/file/:fileId/delete", postDeleteFile);

module.exports = fileRouter;
