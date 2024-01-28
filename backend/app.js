const express = require("express");
const app = express();

app.use("/api/posts", (req, res, next) => {
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
