import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import config from "../config";

function Profiles() {
  const [allProfiles, setAllProfiles] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        axios.defaults.headers.common["x-auth-token"] = localStorage.token;
        let res = await axios.get(`${config.baseUrl}/api/profiles/`);
        setAllProfiles(res.data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="background">
      <Navbar />
      <div className="container">
        {allProfiles !== null ? (
          <div className="app-card-list" id="app-card-list">
            {Object.keys(allProfiles).map((key) => (
              <ProfileCard key={key} profileInfo={allProfiles[key]} />
            ))}
          </div>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
}

export default Profiles;
