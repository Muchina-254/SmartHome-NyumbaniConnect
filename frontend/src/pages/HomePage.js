import React from "react";
import FilterBar from "../components/FilterBar";
import FeaturedListings from "../components/FeaturedListings";

function HomePage() {
  return (
    <div>
      <FilterBar />
      <FeaturedListings />
    </div>
  );
}

export default HomePage;
