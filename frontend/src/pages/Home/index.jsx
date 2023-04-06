import { React, useEffect } from "react";
import "./styles.css";

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

function Home() {
  useEffect(() => {
    document.title = "Home - Restify";
  }, []);

  return (
    <>
      <Header />
      <main class="card d-block">
        <h1 class="text-center mb-3 fw-bold">Welcome to Restify!</h1>
        <div class="main-searchbar d-flex mt-4 mb-5">
          <input
            type="text"
            class="form-control"
            id="search"
            placeholder="Search for properties..."
          />
          <button type="button" class="btn btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              class="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </button>
        </div>
        <div class="dropdown d-flex justify-content-between">
          <h3>Picked for you...</h3>
          <div class="property-filter">
            <button
              class="property-order avatar-btn btn dropdown-toggle"
              type="button"
              id="dropdownFilterButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Filters
            </button>
            <ul
              id="filters"
              class="dropdown-menu"
              aria-labelledby="dropdownFilterButton"
            >
              <li class="d-flex justify-content-between">
                Beds:
                <span>
                  <input type="number" placeholder="Min" />
                  <input type="number" placeholder="Max" />{" "}
                </span>
              </li>
              <li class="d-flex justify-content-between">
                Baths:
                <span>
                  <input type="number" placeholder="Min" />
                  <input type="number" placeholder="Max" />{" "}
                </span>
              </li>
              <li class="d-flex justify-content-between">
                Guests:
                <span>
                  <input type="number" placeholder="Min" />
                  <input type="number" placeholder="Max" />{" "}
                </span>
              </li>
              <li class="d-flex justify-content-between">
                Price($):
                <span>
                  <input type="number" placeholder="Min" step="0.01" />
                  <input type="number" placeholder="Max" step="0.01" />
                </span>
              </li>
              <li class="d-flex justify-content-end">
                <a
                  href="/csc309-restify/views/home-alt.html"
                  class="btn btn-secondary mt-2 btn-sm"
                >
                  Apply filters
                </a>
              </li>
            </ul>

            <button
              class="property-order avatar-btn btn dropdown-toggle"
              type="button"
              id="dropdownOrderByButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Price (Low-High)
            </button>
            <ul
              id="orderBy"
              class="dropdown-menu"
              aria-labelledby="dropdownOrderByButton"
            >
              <li>
                <a class="dropdown-item" href="#">
                  Price (High-Low)
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Beds (High-Low)
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Baths (High-Low)
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Guests (High-Low)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="properties-list d-flex justify-content-evenly flex-wrap mt-3"></div>
      </main>
      <Footer />
    </>
  );
}

export default Home;
