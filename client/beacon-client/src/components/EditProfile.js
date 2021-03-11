import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import axios from "axios";
import config from "../config";

function EditProfile() {
  const [formData, setFormData] = useState(null);
  const [bioText, setBioText] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        axios.defaults.headers.common["x-auth-token"] = localStorage.token;
        let res = await axios.get(`${config.baseUrl}/api/profiles/me`);
        setFormData({
          bio: res.data.bio,
          tasks: [...res.data.tasks],
        });
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchData();
  }, []);

  const onChange = (e) => {
    setBioText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bioText.length === 0) return;
    try {
      const data = JSON.stringify({ bio: bioText });
      console.log(data);
      axios.defaults.headers.common["x-auth-token"] = localStorage.token;
      await axios.post(`${config.baseUrl}/api/profiles/`, data, {
        headers: { "Content-Type": "application/json" },
      });
      setFormData({ ...formData, bio: bioText });
      setBioText("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const removeTask = async (task) => {
    try {
      axios.defaults.headers.common["x-auth-token"] = localStorage.token;
      await axios.delete(`${config.baseUrl}/api/profiles/task/` + task._id);
      const updatedTasks = formData.tasks.filter((t) => t._id !== task._id);
      setFormData({
        ...formData,
        tasks: [...updatedTasks],
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="background">
      <Navbar />
      <div className="container">
        {formData !== null ? (
          <form id="edit-profile-form" onSubmit={handleSubmit}>
            <h1>Edit Profile</h1>
            <div className="edit-profile-group">
              <label htmlFor="bio">
                <h2>Bio: </h2>
              </label>
              <span>{formData.bio}</span>
              <input
                type="text"
                placeholder="Update bio here..."
                name="bio"
                value={bioText}
                onChange={(e) => onChange(e)}
              />
              <Button
                id="update-button"
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
              >
                Update
              </Button>
            </div>
            <div className="edit-profile-group">
              <h2>Tasks:</h2>
              <List>
                {formData.tasks.map((task) => (
                  <ListItem key={task._id} role={undefined} button>
                    <ListItemText
                      primary={task.title}
                      secondary={task.description}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => removeTask(task)}>
                        <CloseIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
          </form>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
}

export default EditProfile;
