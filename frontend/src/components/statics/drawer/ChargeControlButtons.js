import React from 'react';
import List from "@material-ui/core/List/List";
import {MoreHoriz, Timeline} from "@material-ui/icons";
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Divider from "@material-ui/core/Divider/Divider";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ChargeControlButtons(updateViewFunc) {

  const classes = useStyles();

  function updateView(buttonId) {
    updateViewFunc.updateViewFunc(buttonId);
  }

  return (
  <div className={classes.root}>
    <List component="nav">

      <ListItem  button onClick={() => {updateView(0);}}>
        <ListItemIcon>
          <Timeline />
        </ListItemIcon>
        <ListItemText primary="Ladepunkte" />
      </ListItem>

      <ListItem button onClick={() => {updateView(1);}}>
        <ListItemIcon>
          <MoreHoriz />
        </ListItemIcon>
        <ListItemText primary="Laden" />
      </ListItem>

    </List>
    <Divider />
  </div>
  )
}