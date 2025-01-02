const db = require("../../config/prismaClient");
const Folder = require("./Folder");

class User {
  static async fetchById(userId) {
    return await db.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  static async fetchByUname(uname) {
    return await db.user.findUnique({
      where: {
        uname: uname,
      },
    });
  }

  static async createUser(uname, pass) {
    const user = await db.user.create({
      data: {
        uname: uname,
        pass: pass,
      },
    });

    await Folder.createRoot(user.id);
  }
}

module.exports = User;
