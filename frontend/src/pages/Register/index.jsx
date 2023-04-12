import React, { useState } from "react";
import "./styles.css";

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

export default function Register() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [avatar, setAvatar] = useState("");

  function handleRegister(event) {
    const body = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: password1,
      repeat_password: password2,
      phone_number: phoneNum,
    };
    if (avatar !== "") {
      body.avatar = avatar;
    }
    event.preventDefault();
    fetch("http://localhost:8000/accounts/signup/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => {
        console.log("res", res);
        return res.json();
      })
      .then((data) => {
        document.querySelector("#responseErrorMessage").innerHTML = "";
        if (!("id" in data)) {
          for (let key in data) {
            document.querySelector(
              "#responseErrorMessage"
            ).innerHTML += `${key.toUpperCase()}: ${data[key]} <br>`;
          }
        } else {
          window.location.replace("/login");
        }
      })
      .catch((err) => console.error("Register API ERROR:", err));
  }

  return (
    <>
      <Header />
      <main className="card d-block">
        <h1 className="text-center mb-3">Sign up</h1>
        <form onSubmit={handleRegister}>
          <div className="name-section row g-2">
            <div className="form-floating col-6 row-el-1">
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className="form-floating col-6 row-el-2">
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
              <label htmlFor="confirmPassword">Last Name</label>
            </div>
          </div>
          <div className="phone-section row g-2">
            <div className="form-floating">
              <input
                type="tel"
                className="form-control"
                id="inputPhone"
                placeholder="(XXX)XXX-XXXX"
                value={phoneNum}
                onChange={(event) => setPhoneNum(event.target.value)}
              />
              <label htmlFor="firstName">Phone number (#)</label>
            </div>
          </div>
          <div className="email-section col">
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <label htmlFor="inputEmail">Email address</label>
            </div>
          </div>
          <div className="password-section row g-2">
            <div className="form-floating col-6 row-el-1">
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                placeholder="Password"
                value={password1}
                onChange={(event) => setPassword1(event.target.value)}
              />
              <label htmlFor="inputPassword">Password</label>
            </div>
            <div className="form-floating col-6 row-el-2">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={password2}
                onChange={(event) => setPassword2(event.target.value)}
              />
              <label htmlFor="confirmPassword">Confirm password</label>
            </div>
          </div>
          <div className="avatar-section mb-4">
            <div className="form-floating">
              <input
                type="file"
                className="form-control"
                id="inputProfile"
                value={avatar}
                onChange={(event) => setAvatar(event.target.value)}
              />
              <label htmlFor="inputProfile">Profile Picture (optional)</label>
            </div>
          </div>
          <p id="responseErrorMessage" />
          <div className="text-center mb-2">
            <button type="submit" className="text-center btn btn-primary">
              Register
            </button>
          </div>
          <div className="text-center">
            Already a user?{" "}
            <a className="text-decoration-none" href="/login">
              Log in!
            </a>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
