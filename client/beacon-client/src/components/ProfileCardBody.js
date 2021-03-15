import React from "react";

const ProfileCardBody = ({ name, bio, taskCount }) => {
  return (
    <div className="card-body">
      <p className="date">Total Tasks: {taskCount}</p>
      <h2>{name}</h2>
      <p className="body-content">{bio}</p>
      <button className="button button-primary">
        <i className="fa fa-chevron-right"></i> Check out profile
      </button>
    </div>
  );
};

export default ProfileCardBody;
