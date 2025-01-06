const { Router } = require("express");
const {
  getUpload,
  postUpload,
  postDeleteFile,
  postDownloadFile,
} = require("../controllers/fileController");
const { uploadFiles, multerError } = require("../config/multer");
const fileRouter = Router();

fileRouter.get("/:folderId/upload", getUpload);
fileRouter.post("/:folderId/upload", uploadFiles, multerError, postUpload);
fileRouter.post("/file/:userId/:folderId/:fileId/download", postDownloadFile);

fileRouter.post("/file/:fileId/delete", postDeleteFile);

module.exports = fileRouter;
