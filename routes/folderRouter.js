const { Router } = require("express");
const {
  getFolder,
  postDeleteFolder,
} = require("../controllers/folderController");
const folderRouter = Router();

folderRouter.post("/folder/:folderId/delete", postDeleteFolder);
folderRouter.get("/:folderId/folder", getFolder);

module.exports = folderRouter;
