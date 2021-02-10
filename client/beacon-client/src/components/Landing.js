import React, { Fragment } from "react";
import Register from "../components/Register";

const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <Register />
      </div>
    </section>
  );
};

export default Landing;
