import { React, useState, useEffect } from "react";

import "./styles.css";
import { Link } from "react-router-dom";

// NEED TO FIX LINKS FOR EACH ANCHOR TAG

export default function Header() {
  const [currentUser, setCurrentUser] = useState(null);
  const [numNotifs, setNumNotifs] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/accounts/currentuser/", {
      headers: {
        Authorization: `Bearer ${localStorage.token ? localStorage.token : ""}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => (data.id ? setCurrentUser(data) : setCurrentUser(null)))
      .catch((err) => {
        console.error("Fetch curr_user ERROR:", err);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/notifications/list/", {
      headers: {
        Authorization: `Bearer ${localStorage.token ? localStorage.token : ""}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setNumNotifs(data.count);
      })
      .catch((err) => console.error("Fetch numNotifs ERROR:", err));
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.replace("/");
  }

  return (
    <header>
      <nav className="navbar bg-body-tertiary fixed-top mb-5">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#0d6efd"
              className="bi bi-r-square-fill align-text-bottom me-2"
              viewBox="0 0 16 16"
            >
              <path d="M6.835 5.092v2.777h1.549c.995 0 1.573-.463 1.573-1.36 0-.913-.596-1.417-1.537-1.417H6.835Z" />
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm3.5 4.002h3.11c1.71 0 2.741.973 2.741 2.46 0 1.138-.667 1.94-1.495 2.24L11.5 12H9.98L8.52 8.924H6.836V12H5.5V4.002Z" />
            </svg>
            <span className="fs-2 fw-bold">Restify</span>
          </a>
          <div>
            {/* If user is logged in then show profile dropdown menu */}
            {currentUser && (
              <>
                <a href="/notifications" className="notification-btn btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="#0d6efd"
                    className="bi bi-bell-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                  </svg>
                  <span className="badge badge-dark bg-primary">
                    {numNotifs}
                  </span>{" "}
                </a>
                <div className="dropdown">
                  <button
                    className="avatar-btn btn dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      id="avatarPhoto"
                      width="36"
                      height="36"
                      src={currentUser.avatar}
                      alt="Profile"
                    />
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/accounts/profile/view/${currentUser.id}`}
                      >
                        My profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/reservations/retrieve/all"
                      >
                        My reservations
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/properties/"
                      >
                        My properties
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {/* Else If user is not logged in then show login/register links */}
            {!currentUser && (
              <>
                <a href="/login" className="btn btn-outline-primary me-2">
                  Log in
                </a>
                <a href="/register" className="btn btn-primary">
                  Sign up
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
  // });
}
