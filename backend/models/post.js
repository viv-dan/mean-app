const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, require },
  content: { type: String, require },
});

module.exports = mongoose.model("Post", postSchema);
