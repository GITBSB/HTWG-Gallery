import React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import LoadingPointsWeeklyChart from "../../../charts/flottenmanager/loadingpoints/LoadingPointsWeeklyChart";
import WeekPicker from "../../../commons/pickers/WeekPicker";
import CenterChartLoader from "../../../commons/rest/CenterChartLoader";
import RESTCalls from "../../../commons/rest/RESTCalls";
import Typography from "@material-ui/core/Typography/Typography";
import DashboardSnackBar from "../../../commons/rest/DashboardSnackBar";
import Utils from "../../../commons/Utils";

class LoadingPointsWeeklyView extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      activeLoadingPoints: [],
      dates: [],
      loaded: false
    };

    this.weekChangeCallback = this.weekChangeCallback.bind(this);
    this.switchViewCallback = this.switchViewCallback.bind(this);
  }

  switchViewCallback(id) {
    var date = new Date(this.from.getYear(), this.from.getMonth(), this.from.getDate() + id);
    this.props.updateLoadingPoints(date);
  }

  to = new Date(2019, 2, 30);
  from = new Date(2019, 2, 24);

  async componentDidMount() {
    await this.requestData();
  }

  async requestData() {
    this.setState({loaded: false});

    let response = await RESTCalls.requestActiveChargingpointsWeekCount("diakoniestation_kirchheim_teck", "1d",
      this.to, this.from);

    var activeLoadingPoints = [];

    if(response != null) {
      for (let i = 0; i < 7; i++) {
        activeLoadingPoints[i] = response.numbs[i];
      }

      var dates = this.createFormattedDates(this.from);

      this.setState({loaded: true, activeLoadingPoints: activeLoadingPoints, dates: dates});
    } else {
      this.setState({loaded: true, activeLoadingPoints: null, dates: null});
    }
  }

  createFormattedDates(from) {
    var result = [];

    for(var i=0 ; i<7 ; i++) {
      result[i] = Utils.createDayMonthText(from);
      from = new Date(from.getYear(), from.getMonth(), from.getDate() + 1);
    }

    return result;
  }

  async weekChangeCallback(from, to) {
    this.from = from;
    this.to = to;
    await this.requestData();
  }

  createContent() {
    if(this.state.activeLoadingPoints != null) {
      return(
        <LoadingPointsWeeklyChart points={this.state.activeLoadingPoints} dates={this.state.dates} switchViewCallback={this.switchViewCallback}/>
      )
    } else {
      return(
        <DashboardSnackBar />
      )
    }
  }

  createTitle() {
    return (
      <Typography variant="h5" component="h3" style={{paddingTop: "20px", paddingLeft: "20px", float: "left"}}>
        Aktive Ladepunkte in dem Zeitraum {this.toYearDate(this.from)} - {this.toYearDate(this.to)}
      </Typography>
    );
  }

  toYearDate(date) {
    let result = "";

    if(date.getDate() < 10) {
      result += "0" + date.getDate();
    } else {
      result += date.getDate();
    }

    result += ".";

    if(date.getMonth()+1 < 10) {
      result += "0" + (date.getMonth()+1);
    } else {
      result += (date.getMonth()+1);
    }

    return result + "." + date.getFullYear();
  }

  render () {
    return (
      <Paper className={this.props.classes}>
        {this.createTitle()}
        <div style={{paddingLeft: "4%", paddingTop: "8%"}}>
          <WeekPicker weekChangeCallback={this.weekChangeCallback} text={"Starttag auswählen"} date={this.from}/>
        </div>

        <div style={{"height": "350px"}} >
          {this.state.loaded ? this.createContent() : <CenterChartLoader/>}
        </div>
      </Paper>
    )
  }

}

export default LoadingPointsWeeklyView;