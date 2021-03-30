import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAllProfiles } from "../api/UserAPI";

function Profiles() {
  const [allProfiles, setAllProfiles] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllProfiles();
        setAllProfiles(data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
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
