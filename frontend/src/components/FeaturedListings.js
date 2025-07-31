import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturedListings.css";

const FeaturedListings = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const userLoggedIn = localStorage.getItem("token");

  // Fetch listings when component loads
  useEffect(() => {
    fetch("http://localhost:5000/api/properties")
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => console.error("Error fetching listings:", err));
  }, [userLoggedIn]);

  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="listings-wrapper">
      <input
        type="text"
        placeholder="Search listings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="featured-listings">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing, index) => (
            <div className="featured-card" key={index}>
              <img
                src={listing.image || fallbackImage}
                alt={listing.title}
                onError={(e) => (e.target.src = fallbackImage)}
              />
              <h3>{listing.title}</h3>
              <p>{listing.price}</p>
              <p>{listing.location}</p>
              <p>⭐ {listing.rating}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No listings found.</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedListings;
