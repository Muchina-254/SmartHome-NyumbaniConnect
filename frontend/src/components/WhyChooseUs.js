import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const issues = [
    {
      title: "Tenant Fraud",
      description:
        "Prospective tenants often fall victim to fake listings from scammers posing as landlords or agents.",
    },
    {
      title: "High Vacancy Periods",
      description:
        "Landlords struggle to fill units with verified tenants in a fast and secure way.",
    },
    {
      title: "Developer Sales Challenges",
      description:
        "Real estate developers lack an efficient platform to showcase projects and reach buyers directly.",
    },
  ];

  return (
    <div className="why-container">
      <h2>Why Choose NyumbaniConnect?</h2>
      <div className="why-card-scroll">
        {issues.map((issue, index) => (
          <div className="why-card" key={index}>
            <h3>{issue.title}</h3>
            <p>{issue.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
