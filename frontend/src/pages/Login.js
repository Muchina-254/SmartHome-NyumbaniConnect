import React, { useState } from "react";
import "./PageStyles.css";

const roleDescriptions = {
  tenant: "Tenant Fraud: Prospective tenants often face fraud from con artists posing as landlords or property agents.",
  landlord: "High Vacancy Periods for Landlords: Landlords struggle to quickly and easily fill vacancies with trustworthy tenants.",
  developer: "Difficult Sales for Developers: Real estate developers face challenges in showcasing properties and connecting directly with buyers.",
  agent: "Agents often face difficulties gaining visibility and establishing trust among clients in a competitive market."
};

function Login() {
  const [role, setRole] = useState("tenant");

  return (
    <div className="page-container">
      <h2>Login</h2>
      <form className="form-box">
        <label>Email:</label>
        <input type="email" required />

        <label>Password:</label>
        <input type="password" required />

        <label>Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="tenant">Tenant</option>
          <option value="landlord">Landlord</option>
          <option value="developer">Developer</option>
          <option value="agent">Agent</option>
        </select>

        <p className="role-description">{roleDescriptions[role]}</p>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
