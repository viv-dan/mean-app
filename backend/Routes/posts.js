const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
const multer = require("multer");
const checkAuth = require("../middleware/checkauth");

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
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.post
);

router.patch(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.patch
);

router.get("/:id", postController.getPostWithId);

router.get("", postController.getPost);

router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
