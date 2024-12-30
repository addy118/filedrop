const db = require("../config/prismaClient");

const main = async () => {
  const records = await db.folder.findFirst({
    where: {
      userId: 1,
      id: 3,
    },
    include: {
      subFolders: true,
      files: true,
    },
  });

  console.log(records);
};

main();
