import React, { useState } from "react";
import "./styles.css";

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  function handleLogin(event) {
    event.preventDefault();
    fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if ("detail" in data) {
          document.querySelector("#responseErrorMessage").innerHTML =
            data.detail;
        } else {
          localStorage.setItem("token", data.access);
          window.location.replace("/");
        }
      })
      .catch((err) => console.error("API Token Post ERROR:", err));
  }

  return (
    <>
      <Header />
      <main className="card d-block">
        <h1 className="text-center mb-3">Log in</h1>
        <form onSubmit={handleLogin}>
          <div className="form-floating">
            <input
              type="email"
              value={loginEmail}
              className="form-control"
              id="inputEmail"
              placeholder="name@example.com"
              onChange={(event) => setLoginEmail(event.target.value)}
            />
            <label htmlFor="inputEmail">Email address</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              value={loginPassword}
              className="form-control"
              id="inputPassword"
              placeholder="Password"
              onChange={(event) => setLoginPassword(event.target.value)}
            />
            <label htmlFor="inputPassword">Password</label>
          </div>
          <p id="responseErrorMessage" />
          <div className="text-center mb-3">
            <input
              type="submit"
              className="text-center btn btn-primary"
              value="Login"
            />
          </div>
          <div className="text-center">
            New user?{" "}
            <a className="text-decoration-none" href="/register">
              Sign up!
            </a>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
