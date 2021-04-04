import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  box: {
    backgroundColor: "#fff",
    border: "1px solid lightgrey",
    marginBottom: "10px",

    textAlign: "right",
    padding: "10px 14px 10px 14px",
    borderTopColor: "#e44d3a",
    borderTopWidth: "medium",
  },
  button: {
    fontFamily: ["Open Sans", "sans serif"].join(","),
    fontWeight: "900",
    fontSize: "17px",
    color: "#fff",
    backgroundColor: "#e44d3a",
    padding: "5px 15px",
    borderRadius: "5px",
    borderStyle: "none",
  },
});

const AddNewTask = ({ toggleDisplayAddTask }) => {
  const classes = useStyles();

  return (
    <Box minWidth={343} className={classes.box}>
      <button onClick={() => toggleDisplayAddTask()} className={classes.button}>
        Add New Task
      </button>
    </Box>
  );
};

export default AddNewTask;
