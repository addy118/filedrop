const db = require("../config/prismaClient");
const File = require("./queries/File");
const Folder = require("./queries/Folder");

const main = async () => {
  const file = await File.getById(2);
  // const file = await db.file.findFirst({
  //   where: {
  //     id: 2,
  //   },
  // });

  console.log(file.folderId);
};

main();
