import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ListItemText from "@material-ui/core/ListItemText";
import axios from "axios";
import config from "../config";

function EditProfile() {
  const [formData, setFormData] = useState(null);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit.");
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
          <form id="edit-profile-form" onSubmit={() => handleSubmit()}>
            <h1>Edit Profile</h1>
            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <input
                type="text"
                placeholder="Bio"
                name="bio"
                value={formData.bio}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tasks">Tasks:</label>
            </div>
            <List>
              {formData.tasks.map((task) => (
                <ListItem key={task._id} role={undefined} dense button>
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
          </form>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
}

export default EditProfile;
