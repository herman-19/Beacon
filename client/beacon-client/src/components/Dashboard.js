import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuCollapsible from "../components/MenuCollapsible";
import SharedTasksCollapsible from "../components/SharedTasksCollapsible";
import axios from "axios";
import config from "../config";

import Navbar from "./Navbar";

import penetrator from "../img/penetrator.jpeg";

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    textAlign: "center",
    boxShadow: "none",
    border: "1px solid lightgrey",
    margin: "auto",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  collapsible: {
    border: "10px solid lightgrey",
  },
});

const Dashboard = () => {
  const [myProfile, setMyProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      try {
        axios.defaults.headers.common["x-auth-token"] = localStorage.token;
        let res = await axios.get(`${config.baseUrl}/api/profiles/me`);
        setMyProfile(res.data);

        res = await axios.get(`${config.baseUrl}/api/profiles/`);
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
      {myProfile !== null && allProfiles !== null ? (
        <div className="container row">
          <div id="bio-block">
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={penetrator}
                  title="User Image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {myProfile.user.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {myProfile.bio}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <div className="card-segment-horizontal">
                <h3>Pending Tasks</h3>
                <p>{myProfile.tasks.length}</p>
              </div>
              <div className="card-segment-horizontal">
                <Link to="/edit-profile" id="edit-profile-link">
                  <span>edit profile</span>
                </Link>
              </div>
            </Card>
          </div>

          <div id="main-block">
            <MenuCollapsible
              items={myProfile.tasks}
              title="My Tasks"
              className={classes.collapsible}
            />

            <SharedTasksCollapsible
              profiles={allProfiles}
              myId={myProfile.user._id}
              title="Shared Tasks"
              className={classes.collapsible}
            />
          </div>
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default Dashboard;
