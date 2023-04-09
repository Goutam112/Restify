/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import { React, useEffect, useState } from "react";
import "./styles.css";

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

import Searchbar from "../../components/Searchbar";
import FilterSorter from "../../components/FilterSorter";
import PropertyCard from "../../components/PropertyCard";

function Home() {
  const [propertyList, setPropertyList] = useState([]);
  const [queryParams, setQueryParams] = useState({
    country: null,
    minPrice: null,
    maxPrice: null,
    minGuests: null,
    orderBy: null,
  });

  useEffect(() => {
    document.title = "Home - Restify";
  }, []);

  useEffect(() => {
    let queryString = "";
    if (queryParams) {
      switch (queryParams) {
        case queryParams.country:
          queryString += `country=${queryParams.country}&`;
        case queryParams.minPrice:
          queryString += `minPrice=${queryParams.minPrice}&`;
        case queryParams.maxPrice:
          queryString += `maxPrice=${queryParams.maxPrice}&`;
        case queryParams.minGuests:
          queryString += `minGuests=${queryParams.minGuests}&`;
        case queryParams.orderBy:
          queryString += `orderBy=${queryParams.orderBy}`;
      }
    }
    fetch(`http://localhost:8000/properties/retrieve/all/?${queryString}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPropertyList && setPropertyList(data.results);
      })
      .catch((err) => console.error("Fetch properties ERROR:", err));
  }, [queryParams, setPropertyList]);

  return (
    <>
      <Header />
      <main className="card d-block">
        <h1 className="text-center mb-3 fw-bold">Welcome to Restify!</h1>
        <Searchbar />
        <div className="dropdown d-flex justify-content-between">
          <h3>Picked for you...</h3>
          <FilterSorter />
        </div>

        <div className="properties-list d-flex justify-content-evenly flex-wrap mt-3">
          {propertyList &&
            propertyList.map(function (property, i) {
              return <PropertyCard key={i} property={property} />;
            })}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Home;
