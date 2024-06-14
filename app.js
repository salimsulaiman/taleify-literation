const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const path = require("path");
dotenv.config();

app.use(express.json());
app.use(cors());

// import routes
const literationRoutes = require("./routes/literation");
const authorRoutes = require("./routes/author");
const userRoutes = require("./routes/user");
const genreRoutes = require("./routes/genre");
const userLiterationRoutes = require("./routes/user_literation");
const storyRoutes = require("./routes/story");
const questionRoutes = require("./routes/question");
const userAnswerRoutes = require("./routes/user_answer");
const userPointRoutes = require("./routes/user_point");
const imageRoutes = require("./routes/image");
const ratingRoutes = require("./routes/rating");

// serve static file
app.use(
  "/image/profile",
  express.static(path.join(__dirname, "image/profile"))
);

// routes
app.use("/literation", literationRoutes);
app.use("/author", authorRoutes);
app.use("/user", userRoutes);
app.use("/genre", genreRoutes);
app.use("/user_literation", userLiterationRoutes);
app.use("/story", storyRoutes);
app.use("/question", questionRoutes);
app.use("/user_answer", userAnswerRoutes);
app.use("/user_point", userPointRoutes);
app.use("/image", imageRoutes);
app.use("/rating", ratingRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

db.on("error", console.error.bind(console, "Database connect Error!"));
db.once("open", () => {
  console.log("Database is Connected");
});

app.listen(process.env.PORT);
