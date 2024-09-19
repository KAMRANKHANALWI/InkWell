const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const CommentModel = model("Coment", commentSchema);

module.exports = CommentModel;
