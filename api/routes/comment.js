const { Router } = require("express");
const { checkForAuthenticationCookie } = require("../middleware/auth");
const {
  createComment,
  getCommentsForPost,
} = require("../controllers/commentController");

const router = Router();

// Use the middleware to check if the user is authenticated
router.post(
  "/post/comment/:postId",
  checkForAuthenticationCookie("token"),
  createComment
);

// Fetch comments for a specific post (no authentication needed)
router.get("/comments/:postId", getCommentsForPost);

module.exports = router;
