import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Navbar from "../components/Navbar";
import MenuCollapsible from "../components/MenuCollapsible";
import axios from "axios";
import config from "../config";

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

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { id } = useParams();
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      try {
        axios.defaults.headers.common["x-auth-token"] = localStorage.token;
        let res = await axios.get(`${config.baseUrl}/api/profiles/user/${id}`);
        setUserProfile(res.data);
        console.log(res.data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      {userProfile !== null ? (
        <div className="container row">
          <div id="bio-block">
            <Card className={classes.root}>
              <CardActionArea>
                {userProfile.img && (
                  <CardMedia
                    className={classes.media}
                    image={`data:image/${
                      userProfile.img.contentType
                    };base64,${Buffer.from(userProfile.img.data.data).toString(
                      `base64`
                    )}`}
                    title="User Image"
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {userProfile.user.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {userProfile.bio}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <div className="card-segment-horizontal">
                <h3>Pending Tasks</h3>
                <p>{userProfile.tasks.length}</p>
              </div>
            </Card>
          </div>

          <div id="main-block">
            <MenuCollapsible
              items={userProfile.tasks}
              title="Tasks"
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

export default UserProfile;
