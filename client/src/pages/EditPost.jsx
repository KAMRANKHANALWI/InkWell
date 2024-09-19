import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const navigate = useNavigate();

  // const ServerURL = process.env.REACT_APP_BACKEND_URL;
  const ServerURL = "http://localhost:4000";

  useEffect(() => {
    fetch(`${ServerURL}/post/` + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
      });
    });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();

    // Validation check for required fields
    if (!title || !summary || !content) {
      alert("All fields (Title, Summary, Content) are required!");
      return; // Stop execution if validation fails
    }

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files && files?.[0]) {
      data.set("files", files?.[0]);
    }

    const response = await fetch(`${ServerURL}/post`, {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      // setRedirect(true)
      navigate("/post/" + id);
    } else {
      console.error("Failed to create post");
    }
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="title"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}>Update Post</button>
    </form>
  );
};

export default EditPost;
