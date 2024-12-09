require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("./config/auth");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const imageRoute = require("./routes/imageRoutes");

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("SoMatch API is active");
});

app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/mycatalog", imageRoute);

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
