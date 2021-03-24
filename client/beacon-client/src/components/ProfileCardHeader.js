import React from "react";

const ProfileCardHeader = ({ image }) => {
  return (
    <div className="card-header">
     {image.length > 1 && <img src={image} alt="pen" />}
    </div>
  );
};

export default ProfileCardHeader;
