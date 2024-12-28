const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../prisma/queries/User");

const verifyLogin = async (uname, pass, done) => {
  try {
    // verify username
    const user = await User.fetchByUname(uname);
    if (!user) {
      console.log("Incorrect username");
      return done(null, false, { message: "Incorrect username!" });
    }

    // verify password
    const match = await bcrypt.compare(pass, user.pass);
    if (!match) {
      console.log("Incorrect password!");
      return done(null, false, { message: "Incorrect password!" });
    }

    // verification success
    // pass the user which will be passed as param to serializeUser()
    return done(null, user);
  } catch (err) {
    console.error("Error verifying the user: ", err.message);
    console.error("Stack: ", err.stack);
    return done(err);
  }
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "uname",
      passwordField: "pass",
    },
    verifyLogin
  )
);

// called by passport.authenticate()
passport.serializeUser((user, done) => done(null, user.id));

// called on subsequent requests due to middleware app.use(passport.session())
passport.deserializeUser(async (serializedUserId, done) => {
  try {
    const user = await User.fetchById(serializedUserId);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing the user: ", err.message);
    console.error("Stack: ", err.stack);
    return done(err);
  }
});
