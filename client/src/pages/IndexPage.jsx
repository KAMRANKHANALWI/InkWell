import React, { useEffect, useState } from "react";
import Post from "../components/Post";

const IndexPage = () => {
  const [posts, setPosts] = useState([]);

  // const ServerURL = process.env.REACT_APP_BACKEND_URL;
  const ServerURL = "https://inkwell-api.onrender.com";

  useEffect(() => {
    fetch(`${ServerURL}/posts`).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return <>{posts.length > 0 && posts.map((post) => <Post {...post} />)}</>;
};

export default IndexPage;
