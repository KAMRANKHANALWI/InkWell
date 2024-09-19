// blogController.js
const { validateToken } = require("../services/auth");
const Post = require("../models/Post");

const createPost = async (req, res) => {
  const { token } = req.cookies;

  try {
    const user = validateToken(token); // Use validateToken to verify the token
    const { title, summary, content } = req.body;
    // Get the image URL (cloud/local storage)
    const url = req.file.path;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: url, // Image URL from cloud storage
      author: user._id, // Author ID from token payload
    });
    res.status(201).json(postDoc);
  } catch (error) {
    return res.status(403).json({ error: "Invalid token or token expired" });
  }
};

async function editPost(req, res) {
  try {
    const { token } = req.cookies;
    // Validate token
    const userData = validateToken(token);
    if (!userData) {
      return res.status(401).json({ error: "Unauthorized user" });
    }
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the post's author matches the user
    if (post.author.toString() !== userData._id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this post" });
    }

    // Update the post details
    const { title, summary, content } = req.body;
    if (req.file) {
      post.cover = req.file.path; // Handle new image if provided
    }
    post.title = title;
    post.summary = summary;
    post.content = content;

    // Save the updated post
    const updatedPost = await post.save();
    return res.json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function deletePost(req, res) {
  try {
    const { token } = req.cookies;
    const userData = validateToken(token);
    if (!userData) {
      return res.status(401).json({ error: "Unauthorized user" });
    }
    const { id } = req.params;
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (postDoc.author.toString() !== userData._id) {
      return res
        .status(403)
        .json({ msg: "You are not the author of this post" });
    }

    await Post.findByIdAndDelete(id);
    return res.json({ msg: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createPost,
  editPost,
  deletePost,
};
