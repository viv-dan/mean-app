const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, require },
  content: { type: String, require },
  imagePath: { type: String, require },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", postSchema);
