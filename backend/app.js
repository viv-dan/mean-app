const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post added succesfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "fasdfgiajif",
      title: "Post - 1",
      content: "This is the post from Server 1",
    },
    {
      id: "flajshlfkja",
      title: "Post - 2",
      content: "This is the post from Server 2",
    },
    {
      id: "oieurwkfwfw",
      title: "Post - 3",
      content: "This is the post from Server 3",
    },
  ];
  res.status(200).json({
    message: "Posts Retrieved Sucessfully",
    posts: posts,
  });
});

module.exports = app;
