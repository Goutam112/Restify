import React from "react";
import "./styles.css";

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

export default function Login() {
  return (
    <>
      <Header />
      <main className="card d-block">
        <h1 className="text-center mb-3">Log in</h1>
        <form>
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              placeholder="name@example.com"
            />
            <label htmlFor="inputEmail">Email address</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              placeholder="Password"
            />
            <label htmlFor="inputPassword">Password</label>
          </div>
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
