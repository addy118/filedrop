const File = require("../prisma/queries/File");
const supabase = require("../config/supabase");
const Supabase = require("../prisma/queries/Supabase");

exports.getUpload = (req, res) => {
  const { folderId } = req.params;
  res.render("fileForm", { title: "Upload Files", folderId: folderId });
};

exports.postUpload = async (req, res, next) => {
  const { folderId } = req.params;
  const userId = req.user.id;
  console.log("file uploaded");

  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded!");
  }

  try {
    // upload each file to Supabase
    const fileUploadPromises = req.files.map(async (file) => {
      // upload file to supabase
      const { data, error } = await supabase.storage
        .from("files")
        .upload(`${userId}/${folderId}/${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        console.error(`Error uploading file: ${file.originalname}`, error);
        throw new Error(`Failed to upload ${file.originalname}`);
      }

      // retrieve the public URL for the uploaded file
      const { data: publicData, error: urlError } = supabase.storage
        .from("files")
        .getPublicUrl(`${userId}/${folderId}/${file.originalname}`);

      if (urlError) {
        console.error(
          `Error fetching public URL: ${file.originalname}`,
          urlError
        );
        throw new Error(`Failed to fetch public URL for ${file.originalname}`);
      }

      // construct file details
      return {
        name: file.originalname.split(".")[0],
        folderId: Number(folderId),
        // type: file.mimetype.split("/")[1],
        type: file.originalname.split(".")[1],
        size: file.size,
        userId: Number(userId),
        url: publicData.publicUrl + "?download",
      };
    });

    // wait for all uploads to complete
    const files = await Promise.all(fileUploadPromises);

    // save file details to database
    await Promise.all(
      files.map((file) =>
        File.create(
          file.name,
          file.folderId,
          file.type,
          file.size,
          file.userId,
          file.url
        )
      )
    );

    res.redirect(`/${folderId}/folder`);
  } catch (err) {
    console.error("Error uploading files:", err);
    res
      .status(500)
      .send(`Failed to upload files. ${err.message} Please try again!`);
  }
};

exports.postDownloadFile = async (req, res) => {
  const { userId, folderId, fileId } = req.params;

  try {
    const file = await File.getById(Number(fileId));
    const filePath = `${userId}/${folderId}/${file.name}.${file.type}`;

    const { data, error } = await supabase.storage
      .from("files")
      .download(filePath);

    if (error) {
      console.error("Error downloading file:", error);
      return res.status(500).send("Failed to download file.");
    }

    res.setHeader("Content-Type", data.type);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.name}.${file.type}"`
    );

    // convert blob to buffer
    const buffer = await data.arrayBuffer();
    const bufferData = Buffer.from(buffer);

    // write the buffer to the response
    res.write(bufferData);
    res.end();
  } catch (err) {
    console.error("Error: ", err.message);
    res
      .status(500)
      .send(`Failed to process the download request. ${err.message}`);
  }
};

exports.postDeleteFile = async (req, res) => {
  const fileId = Number(req.params.fileId);
  const folderId = await File.getFolderId(fileId);
  try {
    await Supabase.removeFile(fileId, Number(req.user.id));
    await File.deleteById(fileId);
    res.redirect(`/${folderId}/folder`);
  } catch (err) {
    console.error("Error: ", err.message);
    console.error("Stack: ", err.stack);
    res.status(500).end(`Failed to remove files. err.message`);
  }
};
