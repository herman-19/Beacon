import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@mui-treasury/components/menu/collapsible";

const useStyles = makeStyles({
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
    padding: "5px 25px 15px 25px",
    display: "block",
    color: "#000",
  },
  taskTitle: {
    marginBottom: "5px",
  },
  taskDesc: {
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.54)",
  },
});

const MenuCollapsible = (props) => {
  const [index, setIndex] = useState(-1);
  const createOnClick = (idx) => () => setIndex(idx);
  const classes = useStyles();

  const listItems = props.items.map((item) => (
    <Menu.ListItem
      key={item._id}
      button
      selected={index === 1}
      onClick={createOnClick(1)}
      className={classes.listItem}
    >
      <p className={classes.taskTitle}>{item.title}</p>
      <p className={classes.taskDesc}>{item.description}</p>
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

export default MenuCollapsible;
