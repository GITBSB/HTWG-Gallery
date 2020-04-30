import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import PowerIcon from '@material-ui/icons/Power';
import TodayIcon from '@material-ui/icons/Today';
import WeekIcon from '@material-ui/icons/NextWeek';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';
import {MoreHoriz} from "@material-ui/icons";
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function CustomerButtons(updateViewFunc) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState(0);
  const [cycleOpen, setCycleOpen] = React.useState(true);
  const [loadingPointsOpen, setLoadingPointsOpen] = React.useState(true);

  const handleClickCycle = () => {
    setCycleOpen(!cycleOpen);
  };

  const updateSelected = (selectedIndex) =>  {
    setSelected(selectedIndex);
  };

  const handleClickLoadingpoints = () => {
    setLoadingPointsOpen(!loadingPointsOpen);
  };

  function updateView(buttonId) {
    updateViewFunc.updateViewFunc(buttonId);
  }

  function doIt() {
    console.log("Lellek");
  }

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}>
        <ListItem button onClick={handleClickCycle} >
        <ListItemIcon>
          <PowerIcon />
        </ListItemIcon>
        <ListItemText primary="Ladezyklen" />
        {cycleOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={cycleOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <MenuItem button onClick={() => updateSelected(0)} selected={selected === 0}>
          <ListItem component="div" button={false} className={classes.nested} onClick={() => {
            updateView(0);
          }}>
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText primary="Tagesansicht" />
          </ListItem>
          </MenuItem>
          <MenuItem button onClick={() => updateSelected(1)} selected={selected === 1}>

          <ListItem component="div" button={false} className={classes.nested} onClick={() => {
            updateView(1);
          }}>
            <ListItemIcon>
              <WeekIcon />
            </ListItemIcon>
            <ListItemText primary="Wochenansicht" />
          </ListItem>
          </MenuItem>
        </List>
      </Collapse>

      <MenuItem button onClick={() => updateSelected(3)} selected={selected === 3}>
      <ListItem component="div" button={false} onClick={() => {updateView(2);}}>
        <ListItemIcon>
          <BatteryChargingFullIcon />
        </ListItemIcon>
        <ListItemText primary="Energieverbrauch" />
      </ListItem>
      </MenuItem>

      <ListItem button onClick={handleClickLoadingpoints}>
        <ListItemIcon>
          <MoreHoriz />
        </ListItemIcon>
        <ListItemText primary="Ladepunkte" />
        {loadingPointsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={loadingPointsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <MenuItem button onClick={() => updateSelected(4)} selected={selected === 4}>
          <ListItem component="div" button={false} className={classes.nested} onClick={() => {
            updateView(3);
          }}>
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText primary="Tagesansicht" />
          </ListItem>
          </MenuItem>
          <MenuItem button onClick={() => updateSelected(5)} selected={selected === 5}>
          <ListItem id="WochenAnsicht" component="div" button={false} className={classes.nested} onClick={() => {
            updateView(4);
          }}>
            <ListItemIcon>
              <WeekIcon />
            </ListItemIcon>
            <ListItemText primary="Wochenansicht" />
          </ListItem>
          </MenuItem>
        </List>
      </Collapse>
    </List>
  );
}