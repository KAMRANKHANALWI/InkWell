import React, { useState } from "react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const ServerURL = process.env.REACT_APP_BACKEND_URL;
  const ServerURL = "https://inkwell-api.onrender.com";

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(`${ServerURL}/register`, {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 201) {
      alert("Registration Successful");
    } else {
      alert("Registration Failed");
    }
  }

  return (
    <div>
      <img src="../asset/front_logo.png" alt="" />
      <form className="register" onSubmit={register}>
        {/* <h1>Register</h1> */}
        <input
          type="text"
          placeholder="name"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
