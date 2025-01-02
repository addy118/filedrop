const { Router } = require("express");
const {
  getUpload,
  postUpload,
  postDeleteFile,
} = require("../controllers/fileController");
const fileRouter = Router();

fileRouter.get("/:folderId/upload", getUpload);
fileRouter.post("/:folderId/upload", postUpload);

fileRouter.post("/file/:fileId/delete", postDeleteFile);

module.exports = fileRouter;
