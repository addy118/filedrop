const Folder = require("../prisma/queries/Folder");

exports.getFolder = async (req, res, next) => {
  const { folderId } = req.params;

  const folderDetails = await Folder.getItemsById(Number(folderId));
  console.log("folder rendered successfully!");

  if (!folderDetails) {
    const err = new Error("Folder Not Found");
    err.status = 404;
    return next(err);
  }

  res.render("folder", {
    title: folderDetails.name,
    views: req.session.view,
    root: folderDetails,
    folderId: folderDetails.id,
  });
};

exports.getNewFolder = (req, res) => {
  const { folderId } = req.params;

  res.render("folderForm", {
    title: "New Folder",
    parentId: folderId,
  });
};

exports.postNewFolder = (req, res) => {
  const { folderId } = req.params;
  const { folderName } = req.body;

  Folder.create(folderName, Number(folderId), req.user.id);
  res.redirect(`/${folderId}/folder`);
};

exports.postDeleteFolder = async (req, res) => {
  const { folderId } = req.params;
  parent = await Folder.getParent(Number(folderId));
  await Folder.deleteById(Number(folderId));

  res.redirect(`/${parent.id}/folder`);
};

exports.appError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("customError", {
    title: "Error",
    file: "Folder Controller",
    error: err.message,
  });
};
