import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useForm } from "react-hook-form";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { createNewTask } from "../api/UserAPI";

const useStyles = makeStyles({
  box: {
    backgroundColor: "#fff",
    borderWidth: "1px",
    borderColor: "lightgrey",

    textAlign: "right",
    padding: "25px 40px",
  },
  buttonAdd: {
    fontFamily: ["Open Sans", "sans serif"].join(","),
    fontWeight: "900",
    fontSize: "17px",
    color: "#fff",

    padding: "5px 15px",
    borderRadius: "5px",
    borderStyle: "none",
    backgroundColor: "#e44d3a",
    marginLeft: "5px",
  },
  buttonCancel: {
    fontFamily: ["Open Sans", "sans serif"].join(","),
    fontWeight: "900",
    fontSize: "17px",
    color: "#000",

    padding: "5px 15px",
    borderRadius: "5px",
    borderStyle: "solid",
    border: "1px grey",
    backgroundColor: "#fff",
    marginLeft: "5px",
  },
  field: {
    display: "block",
    width: "100%",
    border: "1.5px solid lightgrey",
    borderRadius: "3px",
    height: "20px",
    padding: "15px 10px",
    margin: "15px 0",
  },
  deadlineField: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  cardTop: {
    backgroundColor: "#e44d3a",
    color: "#fff",
    padding: "15px",
  },
  card: {
    border: "1px solid lightgrey",
    marginBottom: "10px",
  },
});

const AddNewTaskForm = ({ show, toggleDisplayAddTask, updateDashboard }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const [isUpdating, setUpdating] = useState(false);

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const data = await createNewTask(formData);
      updateDashboard(data);
      setUpdating(false);
    } catch (error) {
      console.error(error.response.data.errors[0].msg);
    }
    toggleDisplayAddTask();
  };

  return (
    <div>
      {show && (
        <div className={classes.card}>
          <div className={classes.cardTop}>
            <h3>Add New Task</h3>
          </div>
          <Box minWidth={343} className={classes.box}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                name="title"
                className={classes.field}
                ref={register({
                  required: "Title is required.",
                })}
                placeholder="Title"
              />
              {errors.title && (
                <h5 className="error">{errors.title.message}</h5>
              )}
              <input
                type="text"
                name="description"
                className={classes.field}
                ref={register({
                  required: "Description is required.",
                })}
                placeholder="Description"
              />
              {errors.description && (
                <h5 className="error">{errors.description.message} </h5>
              )}
              <div className={classes.deadlineField}>
                <label htmlFor="deadline">Deadline:</label>
                <input
                  type="date"
                  name="deadline"
                  ref={register({
                    required: "Deadline is required.",
                  })}
                />
              </div>
              <button
                onSubmit={handleSubmit(onSubmit)}
                type="submit"
                className={classes.buttonAdd}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => toggleDisplayAddTask()}
                className={classes.buttonCancel}
              >
                Cancel
              </button>
            </form>
            {isUpdating && <CircularProgress />}
          </Box>
        </div>
      )}
    </div>
  );
};

export default AddNewTaskForm;
