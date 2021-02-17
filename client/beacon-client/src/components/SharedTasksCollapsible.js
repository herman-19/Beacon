import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@mui-treasury/components/menu/collapsible";

import penetrator from "../img/penetrator.jpeg";

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: "#fff",
    border: "1px solid lightgrey",
    marginBottom: "10px",
  },
  title: {
    fontFamily: ["Open Sans", "sans serif"].join(","),
    fontWeight: "900",
    fontSize: "20px",
    color: "#000",
  },
  listItem: {
    padding: "15px",
    display: "block",
  },
  taskBlock: {
    padding: "15px 30px 15px 30px",
  },
  taskOwner: {
    color: "#000",
    fontSize: "14px",
  },
  taskTitle: {
    color: "#000",
    marginBottom: "5px",
  },
  taskDesc: {
    fontWeight: "300",
    margin: "0 0 10px 0",
  },
  large: {
    width: theme.spacing(13),
    height: theme.spacing(13),
    margin: "0",
    "@media (max-width: 600px)": {
      margin: "10px auto",
      width: theme.spacing(17),
      height: theme.spacing(17),
    },
  },
}));

const SharedMenuCollapsible = (props) => {
  const [index, setIndex] = useState(-1);
  const createOnClick = (idx) => () => setIndex(idx);
  const classes = useStyles();

  const tasks = [];
  props.profiles.forEach((profile) => {
    if (profile.user._id === props.myId) {
      return;
    }
    profile.tasks.forEach((task) => {
      let taskObj = {};
      taskObj["owner"] = profile.user.name;
      taskObj["title"] = task.title;
      taskObj["description"] = task.description;
      taskObj["id"] = task._id;
      tasks.push(taskObj);
    });
  });
  console.log(tasks);

  const listItems = tasks.map((item) => (
    <Menu.ListItem
      key={item.id}
      button
      selected={index === 1}
      onClick={createOnClick(1)}
      className={classes.listItem}
    >
      <div className="row">
        <Avatar alt="Avatar" src={penetrator} className={classes.large} />
        <div className={classes.taskBlock}>
          <p className={classes.taskTitle}>{item.title}</p>
          <p className={classes.taskDesc}>{item.description}</p>
          <p className={classes.taskOwner}>{item.owner}</p>
        </div>
      </div>
    </Menu.ListItem>
  ));

  return (
    <Box minWidth={343} className={classes.box}>
      <Menu
        collapsed
        renderToggle={({ onClick, collapsed }) => (
          <Menu.Row>
            <Menu.RowItem
              button
              selected={index === 0}
              onClick={createOnClick(0)}
              className={classes.title}
            >
              <h3>{props.title}</h3>
            </Menu.RowItem>
            <Menu.Action button toggled={collapsed} onClick={onClick} />
          </Menu.Row>
        )}
      >
        {listItems}
      </Menu>
    </Box>
  );
};

export default SharedMenuCollapsible;
