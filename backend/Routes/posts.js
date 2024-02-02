const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVaild = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isVaild) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
    });
    post.save().then((result) => {
      res.status(201).json({
        message: "Post added succesfully",
        post: {
          title: result.title,
          content: result.content,
          imagePath: result.imagePath,
          id: result._id,
        },
      });
    });
  }
);

router.patch(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    Post.updateOne(
      { _id: req.params.id },
      {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
      }
    ).then(() => {
      res.status(200).json({
        message: "Post update successful",
      });
    });
  }
);

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
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  Post.count;
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts Retrieved Sucessfully",
        posts: fetchedPosts,
        maxPosts: count,
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
