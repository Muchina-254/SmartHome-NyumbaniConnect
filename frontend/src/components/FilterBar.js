import React, { useState } from "react";
import "./FilterBar.css";

function FilterBar() {
  const [filters, setFilters] = useState({
    roomType: "",
    location: "",
    availability: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="filter-bar">
      <select name="roomType" onChange={handleChange}>
        <option value="">Room Type</option>
        <option value="single">Single Room</option>
        <option value="double">Double Room</option>
        <option value="bedsitter">Bedsitter</option>
        <option value="1br">1 Bedroom</option>
      </select>

      <select name="location" onChange={handleChange}>
        <option value="">Location</option>
        <option value="nairobi">Nairobi</option>
        <option value="thika">Thika</option>
        <option value="ruiru">Ruiru</option>
        <option value="juja">Juja</option>
      </select>

      <select name="availability" onChange={handleChange}>
        <option value="">Availability</option>
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
      </select>
    </div>
  );
}

export default FilterBar;
