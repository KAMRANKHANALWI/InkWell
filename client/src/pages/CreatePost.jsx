import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Editor from "../components/Editor";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  //   const [redirect, setRedirect] = useState(false)
  const navigate = useNavigate();

  // const ServerURL = process.env.REACT_APP_BACKEND_URL;
  const ServerURL = "https://inkwell-api.onrender.com";

  async function createNewPost(ev) {
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
    if (files && files[0]) {
      data.set("files", files[0]);
    }

    const response = await fetch(`${ServerURL}/post`, {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      // setRedirect(true)
      navigate("/");
    } else {
      console.error("Failed to create post");
    }
  }

  //   if(redirect) {
  //     return <Navigate to={"/"} />
  //   }

  return (
    <form onSubmit={createNewPost}>
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
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }}>Create Post</button>
    </form>
  );
};

export default CreatePost;
