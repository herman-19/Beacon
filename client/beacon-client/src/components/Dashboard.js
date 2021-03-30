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
import Navbar from "./Navbar";
import { getMyProfile, getAllProfiles } from "../api/UserAPI";

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
        let data = await getMyProfile();
        setMyProfile(data);
        data = await getAllProfiles();
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
      {myProfile !== null && allProfiles !== null ? (
        <div className="container row">
          <div id="bio-block">
            <Card className={classes.root}>
              <CardActionArea>
                {myProfile.img && (
                  <CardMedia
                    className={classes.media}
                    image={`data:image/${
                      myProfile.img.contentType
                    };base64,${Buffer.from(myProfile.img.data.data).toString(
                      `base64`
                    )}`}
                    title="User Image"
                  />
                )}
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
              title={myProfile.tasks.length ? "My Tasks" : "No Tasks Yet"}
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
