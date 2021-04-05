import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@mui-treasury/components/menu/collapsible";
import HelpOthers from "../img/help-others.png";

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
    "@media (max-width: 600px)": {
      border: "1px solid lightgrey",
    },
  },
  taskBlock: {
    padding: "15px 30px",
    width: "80%",
    "@media (max-width: 600px)": {
      width: "100%",
    },
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
  taskStatus: {
    padding: "15px 30px",
    "@media (max-width: 600px)": {
      margin: "auto",
      textAlign: "center",
      padding: "0px 30px",
    },
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

  const listItemData = [];

  props.profiles.forEach((profile) => {
    if (profile.user._id === props.myId) {
      return;
    }

    const tempData = {};
    const tasks = [];

    if (profile.img) {
      let imgObj = {
        img: Buffer.from(profile.img.data.data).toString("base64"),
        contentType: profile.img.contentType,
      };
      tempData["imgData"] = imgObj;
    }
    profile.tasks.forEach((task) => {
      let taskObj = {};
      taskObj["owner"] = profile.user.name;
      taskObj["title"] = task.title;
      taskObj["description"] = task.description;
      taskObj["id"] = task._id;
      taskObj["status"] = task.status;
      tasks.push(taskObj);
    });
    tempData["tasks"] = tasks;
    listItemData.push(tempData);
  });

  let listElements = [];

  listItemData.forEach((itemData) => {
    let listItems = itemData.tasks.map((item) => {
      return (
        <Menu.ListItem
          key={item.id}
          button
          selected={index === 1}
          onClick={createOnClick(1)}
          className={classes.listItem}
        >
          <div className="row">
            <Avatar
              alt="Avatar"
              src={
                itemData.imgData &&
                `data:image/${itemData.imgData.contentType};base64,${itemData.imgData.img}`
              }
              className={classes.large}
            />
            <div className={classes.taskBlock}>
              <p className={classes.taskTitle}>{item.title}</p>
              <p className={classes.taskDesc}>{item.description}</p>
              <p className={classes.taskOwner}>{item.owner}</p>
            </div>
            <div className={classes.taskStatus}>
              <p className="light-text">STATUS:</p>
              {item.status === "UNRESOLVED" ? (
                <div>
                  <p className="unresolved-text">UNRESOLVED</p>
                  <div className="tooltip">
                    <input
                      onClick={() => {
                        console.log(`Helping Out ${item.owner}!`);
                      }}
                      type="image"
                      id="help-others"
                      src={HelpOthers}
                      alt="help-others"
                      className="tooltip"
                    />
                    <span className="tooltip-text">Offer a Hand</span>
                  </div>
                </div>
              ) : (
                <p className="active-text">ACTIVE</p>
              )}
            </div>
          </div>
        </Menu.ListItem>
      );
    });
    listElements.push(listItems);
  });

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
        {listElements.flat()}
      </Menu>
    </Box>
  );
};

export default SharedMenuCollapsible;
