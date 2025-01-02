const multer = require("multer");
const path = require("path");
const File = require("../prisma/queries/File");

const diskStorage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, done) => {
    const fileExt = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    done(null, file.fieldname + "-" + uniqueSuffix + fileExt);
  },
});

const uploadFiles = multer({
  storage: diskStorage,
  limits: {
    fileSize: 20 * 1000,
    files: 10,
  },
}).array("files", 10);

exports.getUpload = (req, res) =>
  res.render("fileForm", { title: "Upload Files" });

exports.postUpload = async (req, res, next) => {
  // handle uploaded files using multer middleware callback
  uploadFiles(req, res, (err) => {
    // handle multer errors
    if (err instanceof multer.MulterError) {
      return res.status(400).render("fileForm", {
        title: "Upload File",
        errors: [{ msg: err.message }],
      });
    } else if (err) {
      next(err);
    }

    // route handler
    const { folderId } = req.params;

    console.log("file uploaded");
    const files = [];
    req.files.forEach((file) => {
      const fileName = path.parse(file.originalname).name;
      const fileSize = file.size;
      files.push({ name: fileName, size: fileSize });
    });
    console.log(files);

    // await Promise.all(
    //   files.map(file => File.create(file.name, folderId, file.size, req.user.id))
    // );


    res.redirect(`/${folderId}/folder`);
  });
};

exports.postDeleteFile = async (req, res) => {
  const { fileId } = req.params;
  const folderId = await File.getFolderId(Number(fileId));
  await File.deleteById(Number(fileId));
  res.redirect(`/${folderId}`);
};
