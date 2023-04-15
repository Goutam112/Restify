/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import { React, useEffect, useState } from "react";
import "./styles.css";

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

import Searchbar from "../../components/Searchbar";
import PropertyCard from "../../components/PropertyCard";

function Home() {
  const [page, setPage] = useState(1);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [queryParams, setQueryParams] = useState({
    country: "",
    minP: "",
    maxP: "",
    minG: "",
    orderBy: "",
  });

  const nextPage = async () => {
    let newPage = page + 1;
    await setPage(newPage);
  };
  const prevPage = async () => {
    let newPage = page - 1;
    await setPage(newPage);
  };

  useEffect(() => {
    document.title = "Home - Restify";
  }, []);

  useEffect(() => {
    let queryString = "";
    queryString += queryParams.country ? `country=${queryParams.country}&` : "";
    queryString += queryParams.minP ? `minPrice=${queryParams.minP}&` : "";
    queryString += queryParams.maxP ? `maxPrice=${queryParams.maxP}&` : "";
    queryString += queryParams.minG ? `minGuests=${queryParams.minG}&` : "";
    queryString += queryParams.orderBy ? `orderBy=${queryParams.orderBy}&` : "";

    fetch(
      `http://localhost:8000/properties/retrieve/all/?page=${page}&${queryString}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPropertyList(data.results);
        setNextEnabled(data.next ? true : false);
      })
      .catch((err) => console.error("Fetch properties ERROR:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function refetchProperties(event) {
    event.preventDefault();

    let queryString = "";
    queryString += queryParams.country ? `country=${queryParams.country}&` : "";
    queryString += queryParams.minP ? `minPrice=${queryParams.minP}&` : "";
    queryString += queryParams.maxP ? `maxPrice=${queryParams.maxP}&` : "";
    queryString += queryParams.minG ? `minGuests=${queryParams.minG}&` : "";
    queryString += queryParams.orderBy ? `orderBy=${queryParams.orderBy}&` : "";
    setPage(1);
    fetch(
      `http://localhost:8000/properties/retrieve/all/?page=${page}&${queryString}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setNextEnabled(data.next !== null)
        setPropertyList && setPropertyList(data.results)
      })
      .catch((err) => console.error("REFETCH PROPERTIES ERROR:", err));
  }

  return (
    <>
      <Header />
      <main className="card d-block" id="landingPage">
        <h1 className="text-center mb-3 fw-bold">Welcome to Restify!</h1>
        <Searchbar />
        <div className="dropdown d-flex justify-content-between">
          <h3>Picked for you...</h3>

          {/* ========== PROPERTY FILTER & SORTER ========== */}

          <form className="property-filter" onSubmit={refetchProperties}>
            {/* FILTERING PROPERTIES */}
            <button
              className="property-order avatar-btn btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Filters & Sorter
            </button>
            <ul
              id="filters"
              className="dropdown-menu"
              aria-labelledby="dropdownFilterButton"
            >
              <li className="d-flex justify-content-between">
                Country:
                <span>
                  <input
                    type="text"
                    placeholder="Canada"
                    value={queryParams.country}
                    onChange={(event) =>
                      setQueryParams({
                        ...queryParams,
                        country: event.target.value,
                      })
                    }
                  />
                </span>
              </li>
              <li className="d-flex justify-content-between">
                Min Guests:
                <span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={queryParams.minG}
                    onChange={(event) =>
                      setQueryParams({
                        ...queryParams,
                        minG: event.target.value,
                      })
                    }
                  />
                </span>
              </li>
              <li className="d-flex justify-content-between">
                Min Price($):
                <span>
                  <input
                    type="number"
                    placeholder="Min"
                    step="0.01"
                    value={queryParams.minP}
                    onChange={(event) =>
                      setQueryParams({
                        ...queryParams,
                        minP: event.target.value,
                      })
                    }
                  />
                </span>
              </li>
              <li className="d-flex justify-content-between">
                Max Price($):
                <span>
                  <input
                    type="number"
                    placeholder="Max"
                    step="0.01"
                    value={queryParams.maxP}
                    onChange={(event) =>
                      setQueryParams({
                        ...queryParams,
                        maxP: event.target.value,
                      })
                    }
                  />
                </span>
              </li>
              <li className="d-flex flex-column justify-content-between">
                Order By:
                <span>
                  <input
                    type="radio"
                    id="optionPriceASC"
                    name="orderBy"
                    onClick={(event) => {
                      setQueryParams({
                        ...queryParams,
                        orderBy: "priceASC",
                      });
                    }}
                  />
                  <label htmlFor="optionPriceASC">Price (Low-High)</label>
                </span>
                <span>
                  <input
                    type="radio"
                    id="optionPriceDESC"
                    name="orderBy"
                    onClick={(event) => {
                      setQueryParams({
                        ...queryParams,
                        orderBy: "priceDESC",
                      });
                    }}
                  />
                  <label htmlFor="optionPriceDESC">Price (High-Low)</label>
                </span>
                <span>
                  <input
                    type="radio"
                    id="optionBedsASC"
                    name="orderBy"
                    onClick={(event) => {
                      setQueryParams({
                        ...queryParams,
                        orderBy: "bedsASC",
                      });
                    }}
                  />
                  <label htmlFor="optionBedsASC">Beds (Low-High)</label>
                </span>
                <span>
                  <input
                    type="radio"
                    id="optionBedsDESC"
                    name="orderBy"
                    onClick={(event) => {
                      setQueryParams({
                        ...queryParams,
                        orderBy: "bedsDESC",
                      });
                    }}
                  />
                  <label htmlFor="optionBedsDESC">Beds (High-Low)</label>
                </span>
              </li>
              <li className="d-flex justify-content-center">
                <button type="submit" className="btn btn-secondary mt-2 btn-sm">
                  Apply
                </button>
              </li>
            </ul>
          </form>
        </div>

        <div className="properties-list d-flex justify-content-start flex-wrap mt-3">
          {propertyList &&
            propertyList.map(function (property, i) {
              return <PropertyCard key={i} property={property} />;
            })}
        </div>

        <div className="d-flex flex-column justify-content-center paginator-custom">
          <p>
            Page: <b>{page}</b>
          </p>
          <div className="btn-group" role="group">
            <button
              id="notificationPrev"
              onClick={prevPage}
              className="btn btn-secondary btn-sm"
              disabled={page > 1 ? false : true}
            >
              Prev
            </button>
            <button
              id="notificationNext"
              onClick={nextPage}
              className="btn btn-secondary btn-sm"
              disabled={!nextEnabled}
            >
              Next
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Home;
