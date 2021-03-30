import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAllProfiles } from "../api/UserAPI";
import axios from "axios";

function Profiles() {
  const [allProfiles, setAllProfiles] = useState(null);
  const signal = axios.CancelToken.source();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllProfiles(signal.token);
        setAllProfiles(data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchData();

    // Cleanup: Signal to cancel any request.
    return () => {
      signal.cancel("Request for Profiles page canceled.")
    }
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
