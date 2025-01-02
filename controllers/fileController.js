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
    fileSize: 50 * 1000 * 1000,
    files: 10,
  },
}).array("files", 10);

exports.getUpload = (req, res) => {
  const { folderId } = req.params;
  res.render("fileForm", { title: "Upload Files", folderId: folderId });
};

exports.postUpload = async (req, res, next) => {
  try {
    // wrap multer in a promise for async handling
    await new Promise((resolve, reject) =>
      uploadFiles(req, res, (err) => (err ? reject(err) : resolve()))
    );

    const { folderId } = req.params;
    console.log("file uploaded");

    // extract file details and save them in parallel

    const files = [];
    req.files.forEach((file) => {
      const fileName = path.parse(file.originalname).name;
      files.push({
        name: fileName,
        size: file.size,
      });
    });

    await Promise.all(
      files.map((file) => {
        File.create(file.name, Number(folderId), file.size, req.user.id);
      })
    );

    res.redirect(`/${folderId}/folder`);
  } catch (err) {
    // handle multer errors
    if (err instanceof multer.MulterError) {
      return res.status(400).render("fileForm", {
        title: "Upload File",
        errors: [{ msg: err.message }],
      });
    }
    // handle other errors
    next(err);
  }
};

exports.postDeleteFile = async (req, res) => {
  const { fileId } = req.params;
  const folderId = await File.getFolderId(Number(fileId));
  await File.deleteById(Number(fileId));
  res.redirect(`/${folderId}/folder`);
};
