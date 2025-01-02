const { Router } = require("express");
const { getSignup, postSignup, getLogin, postLogin, getLogout, postLogout } = require("../controllers/authController");
const authRouter = Router();

authRouter.get("/signup", getSignup);
authRouter.post("/signup", postSignup);

authRouter.get("/login", getLogin);
authRouter.post("/login", postLogin);

authRouter.get("/logout", getLogout);
authRouter.post("/logout", postLogout);

module.exports = authRouter;
