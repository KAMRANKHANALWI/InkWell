if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const { connectToMongoDb } = require("./connect");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { storage } = require("./cloudConfig");
const uploadMiddleware = multer({ storage });
// const uploadMiddleware = multer({ dest: "uploads/" });

const fs = require("fs");

const salt = bcrypt.genSaltSync(10);
const secret = "gasdjgjhgsdgasCSFTDWRVCV";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

connectToMongoDb(process.env.MONG0URL).then(() =>
  console.log(`MongoDB Connected`)
);

app.get("/", (req, res) => {
  console.log("API is Working Buddy!");
  return res.send("API is Working Buddy!");
}

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userDoc = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt),
    });
    return res.status(201).json(userDoc);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (!userDoc) {
    // If no user is found, return an error
    return res.status(400).json("User not found");
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  //   res.json(passOk);
  if (passOk) {
    // logged in
    jwt.sign(
      { username: userDoc.username, id: userDoc._id },
      secret,
      {},
      (err, token) => {
        if (err) {
          return res.status(500).json("Error signing token");
        }
        res.cookie("token", token).json({
          id: userDoc._id,
          username: userDoc.username,
        });
      }
    );
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    res.json(info); // Send decoded info (username, id, etc.) back to the client
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token"); 
  res.json({ message: "Logged out successfully" });
});

app.post("/post", uploadMiddleware.single("files"), async (req, res) => {
  try {
    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "File not uploaded" });
    }

    // CLOUD STORAGE
    const url = req.file.path;

    const { token } = req.cookies;

    // Verify the token
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }

      const { title, summary, content } = req.body;

      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: url,
        author: info.id,
      });

      res.json(postDoc);
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/posts", async (req, res) => {
  const posts = await Post.find({})
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.put("/post", uploadMiddleware.single("files"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    newPath = req.file.path;
  }

  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Invalid  token" });
    }

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    // res.json({isAuthor})
    if (!isAuthor) {
      return res.status(400).json({ msg: "You are not the Author" });
    }

    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    res.json(postDoc);
  });
});

// Comment API
app.post("/post/comment/:postId", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    const commentDoc = await Comment.create({
      content: req.body.content,
      postId: req.params.postId,
      createdBy: info.id,
    });
    res.json(commentDoc);
  });
});

// Fetch comments for a post
app.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId }).populate(
    "createdBy",
    "username"
  );
  res.json(comments);
});

// Delete
app.delete("/post/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json({ msg: "You are not the Author" });
    }
    await Post.findByIdAndDelete(id);
    res.json({ msg: "Post deleted successfully" });
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
