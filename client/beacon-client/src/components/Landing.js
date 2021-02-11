import React from "react";
import Login from "../components/Login";

import beacon from "../img/beacon-small.png";

const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-box">
          <h1>Beacon</h1>
          <hr />
          <p>Help your friends and family</p>
          <p>—and let them help you!</p>
          <img src={beacon} alt="Beacon" />
          <Login />
        </div>
      </div>
    </section>
  );
};

export default Landing;
