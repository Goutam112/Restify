import React from "react";
import "./styles.css";

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

export default function Register() {
  return (
    <>
      <Header />
      <main class="card d-block">
        <h1 class="text-center mb-3">Sign up</h1>
        <form>
          <div class="name-section row g-2">
            <div class="form-floating mb-2 col-6 row-el-1">
              <input
                type="text"
                class="form-control"
                id="firstName"
                placeholder="John"
              />
              <label for="firstName">First Name</label>
            </div>
            <div class="form-floating mb-2 col-6 row-el-2">
              <input
                type="text"
                class="form-control"
                id="lastName"
                placeholder="Doe"
              />
              <label for="confirmPassword">Last Name</label>
            </div>
          </div>
          <div class="phone-section row g-2">
            <div class="form-floating mb-2 col-6 row-el-1">
              <input
                type="tel"
                class="form-control"
                id="inputPhone"
                placeholder="(XXX)XXX-XXXX"
              />
              <label for="firstName">Phone number (#)</label>
            </div>
            <div class="form-floating mb-2 col-6 row-el-2">
              <input
                type="tel"
                class="form-control"
                id="confirmPhone"
                placeholder="(XXX)XXX-XXXX"
              />
              <label for="confirmPassword">Confirm number (#)</label>
            </div>
          </div>
          <div class="email-section col">
            <div class="form-floating">
              <input
                type="email"
                class="form-control"
                id="inputEmail"
                placeholder="name@example.com"
              />
              <label for="inputEmail">Email address</label>
            </div>
            <div class="form-floating mb-2">
              <input
                type="email"
                class="form-control"
                id="confirmEmail"
                placeholder="name@example.com"
              />
              <label for="confirmEmail">Confirm email</label>
            </div>
          </div>
          <div class="password-section row g-2">
            <div class="form-floating mb-2 col-6 row-el-1">
              <input
                type="password"
                class="form-control"
                id="inputPassword"
                placeholder="Password"
              />
              <label for="inputPassword">Password</label>
            </div>
            <div class="form-floating mb-2 col-6 row-el-2">
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                placeholder="Confirm Password"
              />
              <label for="confirmPassword">Confirm password</label>
            </div>
          </div>
          <div class="avatar-section mb-4">
            <div class="form-floating">
              <input type="file" class="form-control" id="inputProfile" />
              <label for="inputProfile">Profile Picture</label>
            </div>
          </div>
          <div class="text-center mb-2">
            <button type="submit" class="text-center btn btn-primary ">
              Register
            </button>
          </div>
          <div class="text-center">
            Already a user?{" "}
            <a class="text-decoration-none" href="/login">
              Log in!
            </a>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
