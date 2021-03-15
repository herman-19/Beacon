import React from "react";

import penetrator from "../img/penetrator.jpeg";

const ProfileCardHeader = ({ image }) => {
  return (
    <div className="card-header">
      <img src={penetrator} alt="pen" />
    </div>
  );
};

export default ProfileCardHeader;
