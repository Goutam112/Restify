import { React } from "react";
import "./styles.css";

export default function PropertyCard(props) {
  const {
    name,
    property_images,
    description,
    city,
    state,
    country,
    nightly_price,
    amenities,
  } = props.property;

  const location =
    city && state && country ? `${city}, ${state}, ${country}` : "";

  const details = amenities.length > 0 ? `${amenities[0]}` : "";
  const property_image = property_images ? property_images[0].image : "";

  return (
    <div className="card property">
      <img src={property_image} className="card-img-top" alt="property" />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text mb-1">{location}</p>
        <p className="card-text property-stats mt-0 mb-1">{description}</p>
        <p className="card-text property-stats mt-0 mb-1">{details}</p>
        <p className="card-text property-stats mt-0 mb-2">
          ${nightly_price} per night
        </p>
        <button href="#" className="btn btn-secondary btn-sm">
          View property
        </button>
      </div>
    </div>
  );
}
