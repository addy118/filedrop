const express = require("express");
const path = require("path");
require("dotenv").config();
const { getApp, routeError, appError } = require("./controllers/appController");
const { getRouter } = require("./controllers/routerController");

const app = express();

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

// other routers
app.use("/route", getRouter);
app.use("/", getApp);

app.use(routeError);
app.use(appError);

const { PORT } = process.env;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
