const express = require("express");
const path = require("path");
require("dotenv").config();
const { SECRET, PORT } = process.env;
const {
  getApp,
  routeError,
  appError,
  getSignup,
  getLogout,
  postLogout,
  getLogin,
  postSignup,
  postLogin,
  getUpload,
  postUpload,
  getFolder,
  postDeleteFolder,
  handleLogin,
} = require("./controllers/appController");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");
const { validateLogin } = require("./config/validation");
const authRouter = require("./routes/authRouter");
const fileRouter = require("./routes/fileRouter");
const folderRouter = require("./routes/folderRouter");

const app = express();

// prisma session store
app.use(
  session({
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// for passport.deserializeUser() to enable req.user
app.use(passport.session());

// set templates engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// set public dir for serving static files
app.use(express.static(path.join(__dirname, "public")));
// parse form data
app.use(express.urlencoded({ extended: true }));
// parse json data
app.use(express.json());

require("./config/passport");

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", authRouter);
app.use("/", fileRouter);
app.use("/", folderRouter);

app.get("/", getApp);

app.use(routeError);
app.use(appError);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
