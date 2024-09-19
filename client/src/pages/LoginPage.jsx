import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  // const ServerURL = process.env.REACT_APP_BACKEND_URL;
  const ServerURL = "https://inkwell-api.onrender.com";

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch(`${ServerURL}/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    // Check if response is OK
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("Wrong Credentials");
    }
  }

  // Redirect to homepage if login was successful
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="login-main">
      <img src="../asset/front_logo.png" alt="" />
      <form className="login" onSubmit={login}>
        {/* <h1>Login</h1> */}
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
        <button>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;

// import React, { useContext, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [redirect, setRedirect] = useState(false);
//   const { setUserInfo } = useContext(UserContext);

//   async function login(ev) {
//     ev.preventDefault();
//     const response = await fetch("http://localhost:4000/login", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//     });
//     if (response.ok) {
//       response.json().then((userInfo) => {
//         setUserInfo(userInfo);
//         setRedirect(true);
//       });
//     } else {
//       alert("Wrong Credentials");
//     }
//   }

//   if (redirect) {
//     return <Navigate to={"/"} />;
//   }

//   return (
//     <div className="login-container">
//       <div className="login-image">
//         <img src="../asset/front_logo.png" alt="Inkwell Design" />
//       </div>
//       <div className="login-form">
//         <form onSubmit={login}>
//           <h1>Login</h1>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(ev) => setEmail(ev.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(ev) => setPassword(ev.target.value)}
//           />
//           <button>Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
