import React from "react";
import "./PropertyCard.css";

function PropertyCard({ image, title, location, price }) {
  return (
    <div className="property-card">
      <img src={image} alt={title} />
      <div className="property-info">
        <h3>{title}</h3>
        <p>{location}</p>
        <strong>Ksh {price}/month</strong>
      </div>
    </div>
  );
}

export default PropertyCard;
