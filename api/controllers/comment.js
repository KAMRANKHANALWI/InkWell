const Comment = require("../models/Comment");

async function createComment(req, res) {
  try {
    // The user object is already available due to checkForAuthenticationCookie middleware
    const commentDoc = await Comment.create({
      content: req.body.content,
      postId: req.params.postId,
      createdBy: req.user._id, // The authenticated user's ID
    });
    res.json(commentDoc);
  } catch (err) {
    return res.status(403).json({ error: "Unable to create comment" });
  }
}

// Fetch comments for a specific post
async function getCommentsForPost(req, res) {
  try {
    const { postId } = req.params;
    // Find all comments for the given post and populate the 'createdBy' field with the user's 'username'
    const comments = await Comment.find({ postId }).populate("createdBy", "username");
    res.json(comments);
  } catch (err) {
    return res.status(500).json({ error: "Unable to fetch comments" });
  }
}

module.exports = {
  createComment,
  getCommentsForPost,
};


// const { validateToken } = require("../services/auth");
// const Comment = require("../models/Comment");

// // Create a comment
// async function createComment(req, res) {
//   const { token } = req.cookies;

//   try {
//     const userPayload = validateToken(token);
//     const commentDoc = await Comment.create({
//       content: req.body.content,
//       postId: req.params.postId,
//       createdBy: userPayload._id,
//     });

//     res.json(commentDoc);
//   } catch (err) {
//     return res.status(403).json({ error: "Invalid token" });
//   }
// }

// // Fetch comments for a post
// async function getCommentsForPost(req, res) {
//   const { postId } = req.params;
//   const comments = await Comment.find({ postId }).populate("createdBy", "username");

//   res.json(comments);
// }

// module.exports = {
//   createComment,
//   getCommentsForPost,
// };

