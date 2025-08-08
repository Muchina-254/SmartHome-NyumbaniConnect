import React from 'react';
import './WhatWeOffer.css';
import { FaUserShield, FaKey, FaBuilding } from 'react-icons/fa';

const WhatWeOffer = () => {
  const services = [
    { icon: <FaUserShield />, title: 'Verified Listings', desc: 'We protect you from rental scams and fake agents.' },
    { icon: <FaKey />, title: 'Instant Access', desc: 'Get access to rentals and homes as soon as they’re available.' },
    { icon: <FaBuilding />, title: 'Developer Tools', desc: 'Tools for developers to showcase and sell new builds.' },
  ];

  return (
    <div className="offer-container">
      <h2>What We Offer</h2>
      <div className="offer-grid">
        {services.map((item, idx) => (
          <div className="offer-card" key={idx}>
            <div className="icon">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatWeOffer;
