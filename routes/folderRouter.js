const { Router } = require("express");
const {
  getFolder,
  postDeleteFolder,
  getNewFolder,
  postNewFolder,
} = require("../controllers/folderController");
const folderRouter = Router();

folderRouter.post("/folder/:folderId/delete", postDeleteFolder);
folderRouter.get("/:folderId/folder", getFolder);

folderRouter.get("/:folderId/create", getNewFolder);
folderRouter.post("/:folderId/create", postNewFolder);

folderRouter.post(
  "/folder/:userId/:parentId/:folderId/download",
  postDownloadFolder
);

module.exports = folderRouter;
