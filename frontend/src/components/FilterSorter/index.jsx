import { React } from "react";
import "./styles.css";

export default function FilterSorter() {
  return (
    <div className="property-filter">
      <button
        className="property-order avatar-btn btn dropdown-toggle"
        type="button"
        id="dropdownFilterButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Filters
      </button>
      <ul
        id="filters"
        className="dropdown-menu"
        aria-labelledby="dropdownFilterButton"
      >
        <li className="d-flex justify-content-between">
          Country:
          <span>
            <input type="text" placeholder="Canada" />
          </span>
        </li>
        <li className="d-flex justify-content-between">
          Min Guests:
          <span>
            <input type="number" placeholder="Min" />
          </span>
        </li>
        <li className="d-flex justify-content-between">
          Min Price($):
          <span>
            <input type="number" placeholder="Min" step="0.01" />
          </span>
        </li>
        <li className="d-flex justify-content-between">
          Max Price($):
          <span>
            <input type="number" placeholder="Max" step="0.01" />
          </span>
        </li>
        <li className="d-flex justify-content-end">
          <a
            href="/csc309-restify/views/home-alt.html"
            className="btn btn-secondary mt-2 btn-sm"
          >
            Apply filters
          </a>
        </li>
      </ul>

      <button
        className="property-order avatar-btn btn dropdown-toggle"
        type="button"
        id="dropdownOrderByButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Sort By
      </button>
      <ul
        id="orderBy"
        className="dropdown-menu"
        aria-labelledby="dropdownOrderByButton"
      >
        <li>
          <button className="dropdown-item" href="#">
            Price (Low-High)
          </button>
        </li>
        <li>
          <button className="dropdown-item" href="#">
            Price (High-Low)
          </button>
        </li>
        <li>
          <button className="dropdown-item" href="#">
            Beds (Low-High)
          </button>
        </li>
        <li>
          <button className="dropdown-item" href="#">
            Beds (High-Low)
          </button>
        </li>
      </ul>
    </div>
  );
}
