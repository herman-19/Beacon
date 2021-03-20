import React, { useEffect, useState, useRef } from "react";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        axios.defaults.headers.common["x-auth-token"] = localStorage.token;
        let res = await axios.get(`${config.baseUrl}/api/profiles/me`);
        setFormData({
          bio: res.data.bio,
          tasks: [...res.data.tasks],
          img: res.data.img,
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
    setIsUpdating(true);
    try {
      const fd = new FormData();

      if (fileInput.current.files.length > 0) {
        if (fileInput.current.files[0].size > 16e6) {
          window.alert("Please upload a file smaller than 16 MB.");
          return;
        }
        const parts = selectedFile.name.split(".");
        const ext = parts[parts.length - 1];
        fd.append("profileImage", selectedFile);
        fd.append("contentType", ext);
      }

      if (bioText) {
        fd.append("bio", bioText);
      } else {
        fd.append("bio", formData.bio);
      }

      axios.defaults.headers.common["x-auth-token"] = localStorage.token;
      const res = await axios.post(`${config.baseUrl}/api/profiles/`, fd, {
        headers: { "Content-Type": "application/json" },
      });
      setIsUpdating(false);
      setFormData({
        ...formData,
        bio: bioText.length > 1 ? bioText : formData.bio,
        img: res.data.img,
      });
      console.log(formData);
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

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        {formData !== null ? (
          <form
            id="edit-profile-form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h3>Edit Profile</h3>
            <div id="image-upload-group">
              {formData.img && (
                <img
                  id="edit-profile-image"
                  src={`data:image/${
                    formData.img.contentType
                  };base64,${Buffer.from(formData.img.data.data).toString(
                    `base64`
                  )}`}
                  alt="User"
                />
              )}
              {isUpdating && <CircularProgress />}
              <input
                ref={fileInput}
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleFileInput}
              />
            </div>
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
                className="text-input"
              />
              <Button
                id="update-button"
                variant="contained"
                color="primary"
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
