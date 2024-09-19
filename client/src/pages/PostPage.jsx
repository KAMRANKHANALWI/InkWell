import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../context/UserContext";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  // const ServerURL = process.env.REACT_APP_BACKEND_URL;
  const ServerURL = "http://localhost:4000";

  useEffect(() => {
    fetch(`${ServerURL}/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);

  // Fetch comments for the post
  useEffect(() => {
    fetch(`${ServerURL}/comments/${id}`).then((response) => {
      response.json().then((data) => {
        setComments(data);
      });
    });
  }, [id]);

  const navigate = useNavigate(); // Initialize navigate

  async function deletePost(postId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    const response = await fetch(`${ServerURL}/post/${postId}`, {
      method: "DELETE",
      credentials: "include", // Send cookies
    });

    if (response.ok) {
      alert("Post deleted successfully");
      navigate("/");
    } else {
      const error = await response.json();
      alert(`Error: ${error.msg}`);
    }
  }

  // Add a new comment
  async function submitComment(e) {
    e.preventDefault();

    const response = await fetch(`${ServerURL}/post/comment/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: commentContent,
      }),
    });

    if (response.ok) {
      const newComment = await response.json();
      setComments([...comments, newComment]); // Add the new comment to the list
      setCommentContent(""); // Clear the comment input
    } else {
      alert("Failed to add comment.");
    }
  }

  if (!postInfo) return "";

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>

      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="btn edit-btn" to={`/edit/${postInfo._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
              //{" "}
            </svg>
            Edit
          </Link>
          <button
            className="btn delete-btn"
            onClick={() => deletePost(postInfo._id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            Delete
          </button>
        </div>
      )}

      <div className="image">
        {/* <img src={`http://localhost:4000/${postInfo.cover}`} alt="" /> */}
        <img src={postInfo.cover} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />

      {/* Comment section */}
      <div className="comments-section">
        <h3 data-comment-count={comments.length}>Comments</h3>
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <strong>{comment.createdBy.username}</strong>
            <p>{comment.content}</p>
          </div>
        ))}

        {/* Only show comment form if user is logged in */}
        {userInfo.id ? (
          <form onSubmit={submitComment} className="comment-form">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button type="submit">Post Comment</button>
          </form>
        ) : (
          <p>You need to be logged in to post a comment.</p> // Message for non-logged-in users
        )}
      </div>
    </div>
  );
};

export default PostPage;
