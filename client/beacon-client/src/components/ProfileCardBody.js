import React from "react";
import { useHistory } from "react-router-dom";

const ProfileCardBody = ({ name, bio, taskCount, userId }) => {
  const history = useHistory();
  const handleClick = async () => {
    history.push(`/profile/${userId}`);
  };

  return (
    <div className="card-body">
      <p className="light-text">TOTAL TASKS: {taskCount}</p>
      <h1>{name}</h1>
      <p className="body-content">{bio}</p>
      <button onClick={handleClick}>Check out profile</button>
    </div>
  );
};

export default ProfileCardBody;
