import React from 'react';
import Paper from "@material-ui/core/Paper/Paper";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import makeStyles from "@material-ui/core/styles/makeStyles";

const width = 240;

export default function TimeSlider({timeChangeCallback}) {
  const classes = useStyles();

  const [timeMenuIndex, setTimeMenuIndex] = React.useState(0);

  const timeMenuChange = (event, newValue) => {
    setTimeMenuIndex(newValue);
    timeChangeCallback(newValue);
  };

  return (
      <Paper className={classes.tabPaper} >
        <Tabs
          value={timeMenuIndex}
          onChange={timeMenuChange}
          indicatorColor="secondary"
          textColor="secondary"
          centered
        >
          <Tab label="Live" />
          <Tab label="Tag" />
          <Tab label="Woche" />
          <Tab label="Monat" />
        </Tabs>
      </Paper>

    )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: width,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  paper: {
    padding: '20px',
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    height: '300px'
  }
}));

