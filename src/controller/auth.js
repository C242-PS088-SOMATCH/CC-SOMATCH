const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./database");

// Serialize user
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM users WHERE id = ?", [id])
    .then(([rows]) => done(null, rows[0]))
    .catch((err) => done(err, null));
});

// Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const [rows] = await db.query("SELECT * FROM users WHERE google_id = ?", [profile.id]);
        if (rows.length) {
          return done(null, rows[0]); // User already exists
        }

        // Create new user
        const [result] = await db.query("INSERT INTO users (name, username, email, google_id) VALUES (?, ?, ?, ?)", [profile.displayName, profile.displayName, profile.emails[0].value, profile.id]);

        const [newUser] = await db.query("SELECT * FROM users WHERE id = ?", [result.insertId]);
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
