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

exports.postDeleteFolder = async (req, res) => {
  const { folderId } = req.params;
  parent = await Folder.getParent(folderId);
  await Folder.deleteById(Number(folderId));

  res.redirect(`/${parent.id}`);
};

exports.appError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("customError", {
    title: "Error",
    file: "Folder Controller",
    error: err.message,
  });
};
