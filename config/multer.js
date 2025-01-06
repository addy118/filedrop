const multer = require("multer");

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

const memoryStorage = multer.memoryStorage();

const uploadFiles = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5.5 * 1000 * 1000,
    files: 10,
  },
}).array("files", 10);

// cleanest way to handle:
const multerError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.send(err.code);
  }
  // successfully move to next middleware
  next();
};

module.exports = { uploadFiles, multerError };
