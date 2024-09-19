import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ServerURL = "http://localhost:4000";
// console.log("Server URL:", ServerURL);

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${ServerURL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch(`${ServerURL}/logout`, {
      credentials: "include",
      method: "POST",
    }).then(() => {
      setUserInfo(null);
      navigate("/login");
    });
  }

  const username = userInfo?.username;
  // console.log("UserInfo",userInfo)

  return (
    <header>
      <Link to="/">
        <img className="logo" src="../asset/logo1.png" />
      </Link>
      <nav>
        <Link to="/">Home </Link>
        {/* if we have username */}
        {username && (
          <>
            <Link to="/">
              <b>| {username}</b> 
            </Link>
            <Link to="/create">| Create Post </Link>
            <a onClick={logout}>| Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
