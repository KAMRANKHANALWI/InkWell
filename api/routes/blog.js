// blogRoute.js
const { Router } = require("express");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const uploadMiddleware = multer({ storage });
const { createPost } = require("../controllers/blogController");
const { editPost } = require("../controllers/postController");
const { checkForAuthenticationCookie } = require("../middleware/auth");
const { deletePost } = require("../controllers/postController");

const router = Router();

// Use middleware to check for authentication
router.post(
  "/post",
  checkForAuthenticationCookie("token"), // Authenticate user using token
  uploadMiddleware.single("files"),
  createPost
);

// PUT request to edit a blog post
router.put(
  "/post/:id",
  checkForAuthenticationCookie("token"),
  uploadMiddleware.single("files"),
  editPost
);

// DELETE request to delete a blog post
router.delete("/post/:id", checkForAuthenticationCookie("token"), deletePost);

module.exports = router;
