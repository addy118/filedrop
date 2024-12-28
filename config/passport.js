const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { fetchUserByName, fetchUserById } = require("../db/queries");

const verifyLogin = async (email, password, done) => {
  try {
    // verify username
    const user = await fetchUserByName(email);
    if (!user) {
      console.log("Incorrect username");
      return done(null, false, { message: "Incorrect username!" });
    }

    // verify password
    const match = await bcrypt.compare(password, user.password);
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
      usernameField: "email",
      passwordField: "password",
    },
    verifyLogin
  )
);

passport.serializeUser((user, done) => done(null, user.user_id));

passport.deserializeUser(async (serializedUserId, done) => {
  try {
    const user = await fetchUserById(serializedUserId);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing the user: ", err.message);
    console.error("Stack: ", err.stack);
    return done(err);
  }
});
