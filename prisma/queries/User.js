const db = require("../../config/prismaClient");

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
    try {
      return await db.user.create({
        data: {
          uname: uname,
          pass: pass,
        },
      });
    } catch (err) {
      console.error("Error: ", err.message);
      console.error("Stack: ", err.stack);
      throw new Error("Error creating user: " + err.message);
    }
  }
}

module.exports = User;
