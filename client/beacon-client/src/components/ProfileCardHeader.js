import React from "react";

const ProfileCardHeader = ({ image }) => {
  return (
    <div className="card-header">
      <img src={image} alt="pen" />
    </div>
  );
};

export default ProfileCardHeader;
