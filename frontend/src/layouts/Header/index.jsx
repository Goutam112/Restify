import { React } from "react";
import "./styles.css";

// NEED TO FIX LINKS FOR EACH ANCHOR TAG

export default function Header() {
  let isLoggedIn = false;
  // fetch("localhost:8000/accounts/currentuser/")
  //   .then((res) => {
  //     isLoggedIn = true;
  //   })
  //   .catch((err) => {
  //     isLoggedIn = false;
  //   })
  //   .finally(() => {
  return (
    <header>
      <nav class="navbar bg-body-tertiary fixed-top mb-5">
        <div class="container-fluid">
          <a class="navbar-brand" href="/csc309-restify/views/home.html">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#0d6efd"
              class="bi bi-r-square-fill align-text-bottom"
              viewBox="0 0 16 16"
            >
              <path d="M6.835 5.092v2.777h1.549c.995 0 1.573-.463 1.573-1.36 0-.913-.596-1.417-1.537-1.417H6.835Z" />
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm3.5 4.002h3.11c1.71 0 2.741.973 2.741 2.46 0 1.138-.667 1.94-1.495 2.24L11.5 12H9.98L8.52 8.924H6.836V12H5.5V4.002Z" />
            </svg>
            <span class="fs-2 fw-bold">Restify</span>
          </a>
        </div>
        <div>
          {/* If user is logged in then show profile dropdown menu */}
          {isLoggedIn && (
            <>
              <a
                href="/csc309-restify/views/notifications.html"
                class="notification-btn btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#0d6efd"
                  class="bi bi-bell-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                </svg>
                {/* NEED TO FETCH NOTIFICATIONS AND DISPLAY NUM_NOTIFS */}
                <span class="badge badge-dark bg-primary">3</span>{" "}
              </a>
              <div class="dropdown">
                <button
                  class="avatar-btn btn dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="#0d6efd"
                    class="bi bi-person-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path
                      fill-rule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                  </svg>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <a
                      class="dropdown-item"
                      href="/csc309-restify/views/users/profile_view.html"
                    >
                      My profile
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="/csc309-restify/views/reservations/my_reservations.html"
                    >
                      My reservations
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="/csc309-restify/views/reservations/my_rental_units.html"
                    >
                      My properties
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="/csc309-restify/views/home-2.html"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </>
          )}
          {/* Else If user is not logged in then show login/register links */}
          {!isLoggedIn && (
            <>
              <a
                href="/csc309-restify/views/users/login.html"
                class="btn btn-outline-primary"
              >
                Log in
              </a>
              <a
                href="/csc309-restify/views/users/sign-up.html"
                class="btn btn-primary"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
  // });
}
