const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((result) => {
    res.status(201).json({
      message: "Post added succesfully",
      id: result.id,
    });
  });
});

router.patch("/:id", (req, res, next) => {
  Post.updateOne(
    { _id: req.params.id },
    {
      title: req.body.title,
      content: req.body.content,
    }
  ).then(() => {
    res.status(200).json({
      message: "Post update successful",
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((respData) => {
    if (respData) {
      res.status(200).json(respData);
    } else {
      res.status(404).json({ message: "post not found" });
    }
  });
});

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts Retrieved Sucessfully",
      posts: documents,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "post deleted",
    });
  });
});

module.exports = router;
