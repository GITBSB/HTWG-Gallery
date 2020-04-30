import React, { Fragment, useState } from 'react';
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'

import Loading from '../../views/chargecontrol/Loading'
import LoadingPoints from '../../views/chargecontrol/LoadingPoints'
import DrawerButtons from "./DrawerButtons";
import ChangeUserButton from "../ChangeUserButton";
import LoadingCycleDailyView from "../../views/flottenmanager/loadingcycle/LoadingCycleDailyView";
import LoadingCycleWeeklyView from "../../views/flottenmanager/loadingcycle/LoadingCycleWeeklyView";
import LoadingPointsDailyView from "../../views/flottenmanager/loadingpoints/LoadingPointsDailyView";
import WeeklyEnergyConsumptionView from "../../views/flottenmanager/other/WeeklyEnergyConsumptionView";
import LoadingPointsWeeklyView from "../../views/flottenmanager/loadingpoints/LoadingPointsWeeklyView";

const drawerWidth = 240;
var loadingPointsDailyDate = null;
var isCallback = false;

function DashboardDrawer (/*{PROPS_GO_HERE}*/) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [loggedInUser, setLoggedInUser] = React.useState(3);
  const [currentViewTitle , setCurrentViewTitle] = React.useState(2);
  const [menuIndex, setMenuIndex] = React.useState(1);
  const [isLoading, setIsLoading] = useState(false);

  function changeUser() {
    setMenuIndex(1); // Show the first one as default.
    if(loggedInUser === 1) {
      setLoggedInUser(2);
      setCurrentViewTitle("Ladezyklen - Tagesansicht");
    } else {
      setLoggedInUser(1);
      setCurrentViewTitle("Ladepunkte");
    }
  }

  function handleDrawerOpen() {
    setOpen(true)
  }

  function handleDrawerClose() {
    setOpen(false)
  }

  function updateLoadingPoints(date) {
    isCallback = true;
    loadingPointsDailyDate = date;
    setMenuIndex(4);
  }

  // Callback
  function updateViewFunc(buttonId){
    setMenuIndex(buttonId+1);

    if(loggedInUser === 1) {
      switch (buttonId) {
        case 0:
          setCurrentViewTitle("Ladepunkte");
          break;
        case 1:
          setCurrentViewTitle("Laden");
          break;
        default:
          setCurrentViewTitle("Unknown view!: " + buttonId);
      }
    } else {
      switch (buttonId) {
        case 0:
          setCurrentViewTitle("Ladezyklen - Tagesansicht");
          break;
        case 1:
          setCurrentViewTitle("Ladezyklen - Wochenansicht");
          break;
        case 2:
          setCurrentViewTitle("Ladepunkte - Tagesansicht");
          break;
        case 3:
          setCurrentViewTitle("Ladepunkte - Wochenansicht");
          break;
        default:
          setCurrentViewTitle("Unknown view!: " + buttonId);
      }
    }
  }

  function getCurrentViewTitle() {
    if(loggedInUser === 1) {
      switch(menuIndex) {
        case 1: return "Ladepunkte";
        case 2: return "Laden";
        default: return "Unknown menuindex: " + menuIndex;
      }
    } else {
      switch(menuIndex) {
        case 1: return "Ladezyklen - Tagesansicht";
        case 2: return "Ladezyklen - Wochenansicht";
        case 3: return "Energieverbrauch";
        case 4: return "Ladepunkte - Tagesansicht";
        case 5: return "Ladepunkte - Wochenansicht";
        default: return "Unknown menuindex: " + menuIndex;
      }
    }
  }

  function getCurrentView(menuIndex) {
    if(loggedInUser === 1) {
      switch (menuIndex) {
        case 1:
          return <LoadingPoints/>;
        case 2:
          return <Loading/>;
        default:
          console.log("Unknown view!: " + menuIndex);
          return <Loading/>;
      }
    } else {

      if(isCallback) {
        isCallback = false;
      } else {
        loadingPointsDailyDate = null;
      }

      switch (menuIndex) {
        case 1:
          return <LoadingCycleDailyView className={classes.tabPaper}/>;
        case 2:
          return <LoadingCycleWeeklyView className={classes.tabPaper}/>;
        case 3:
          return <WeeklyEnergyConsumptionView className={classes.tabPaper}/>;
        case 4:
          return <LoadingPointsDailyView className={classes.tabPaper} loadingPointsDailyDate={loadingPointsDailyDate}/>;
        case 5:
          return <LoadingPointsWeeklyView className={classes.tabPaper} updateLoadingPoints={updateLoadingPoints}/>;
        default:
          console.log("Unknown view!: " + menuIndex);
          return <LoadingCycleDailyView className={classes.tabPaper}/>;
      }
    }
  }

  return (
    <Fragment>
      <div className={classes.root}>
        <CssBaseline/>
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
              <MenuIcon/>
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              {getCurrentViewTitle()}
            </Typography>
            <ChangeUserButton handleChangeUser={changeUser} />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon/>
            </IconButton>
          </div>
          <Divider/>
          <DrawerButtons updateViewFunc={updateViewFunc} loggedInUser={loggedInUser}/>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer}/>
          <Container maxWidth="lg" className={classes.container}>

            {getCurrentView(menuIndex)}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                {isLoading ? <LinearProgress color="secondary"/> : <div />}
              </Grid>
            </Grid>
            <Paper className={classes.tabPaper} />
          </Container>
        </main>
      </div>
    </Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  tabPaper:{
    marginTop:10
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  close: {
    padding: theme.spacing(0.5),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
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
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: '20px',
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    height: '300px'
  },
  fixedHeight: {
    height: 240,
  },
}));

export default DashboardDrawer
