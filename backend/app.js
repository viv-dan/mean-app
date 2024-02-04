const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appRouter = require("./Routes/posts");
const path = require("path");
const userRouter = require("./Routes/user");

mongoose
  .connect(
    "mongodb+srv://dantuviv459:bostonboston@cluster0.botfhjz.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("successfully connected!!");
  })
  .catch(() => {
    console.log("Connection failed!!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images/")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/api/posts", appRouter);
app.use("/api/user", userRouter);

module.exports = app;
