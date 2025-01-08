const db = require("../../config/prismaClient");
const Folder = require("./Folder");

class User {
  static async fetchById(userId) {
    try {
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
      }

      return user;
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  }

  static async fetchByUname(uname) {
    try {
      const user = await db.user.findUnique({
        where: {
          uname: uname,
        },
      });

      if (!user) {
        throw new Error(`User with username ${uname} not found.`);
      }

      return user;
    } catch (error) {
      throw new Error(`Error fetching user by username: ${error.message}`);
    }
  }

  static async createUser(uname, pass) {
    try {
      const user = await db.user.create({
        data: {
          uname: uname,
          pass: pass,
        },
      });

      await Folder.createRoot(user.id);
      return user;
    } catch (error) {
      if (error.code === "P2002" && error.meta.target.includes("uname")) {
        throw new Error(
          `Username ${uname} is already taken. Please choose a different one.`
        );
      }

      throw new Error(`Error creating user: ${error.message}`);
    }
  }
}

module.exports = User;
