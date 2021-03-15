import React from "react";
import axios from "axios";
import config from "../config";

const ProfileCardBody = ({ name, bio, taskCount, userId }) => {
  const handleClick = async () => {
    try {
      axios.defaults.headers.common["x-auth-token"] = localStorage.token;
      const res = await axios.get(
        `${config.baseUrl}/api/profiles/user/${userId}`
      );
      console.log(res.data);
    } catch (error) {
      console.error(error.message);
    }
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
