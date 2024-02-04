const Post = require("../models/post");

exports.post = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  console.log(req.userData);
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
};

exports.patch = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    {
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
    }
  ).then((result) => {
    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: "Post update successful",
      });
    } else {
      res.status(401).json({
        message: "Post update UnSuccesful",
      });
    }
  });
};

exports.getPostWithId = (req, res, next) => {
  Post.findById(req.params.id).then((respData) => {
    if (respData) {
      res.status(200).json(respData);
    } else {
      res.status(404).json({ message: "post not found" });
    }
  });
};

exports.getPost = (req, res, next) => {
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
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "post deleted",
        });
      } else {
        res.status(401).json({
          message: "post not deleted",
        });
      }
    }
  );
};
