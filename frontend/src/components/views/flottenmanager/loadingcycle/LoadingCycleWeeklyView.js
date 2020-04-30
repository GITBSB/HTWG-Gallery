import React, {Fragment} from 'react'
import WeekPicker from "../../../commons/pickers/WeekPicker";
import RESTCalls from "../../../commons/rest/RESTCalls";
import LoadingCycleWeeklyChart from "../../../charts/flottenmanager/loadingcycle/LoadingCycleWeeklyChart";
import CenterChartLoader from "../../../commons/rest/CenterChartLoader";
import Paper from "@material-ui/core/Paper/Paper";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import Utils from "../../../commons/Utils"
import Typography from '@material-ui/core/Typography'
import DashboardSnackBar from "../../../commons/rest/DashboardSnackBar";

class LoadingCycleWeeklyView extends React.Component {

  constructor(props) {
    super(props);

    this.basicWeekChangeCallBack = this.basicWeekChangeCallBack.bind(this);
    this.toCompareWeekChangeCallBack = this.toCompareWeekChangeCallBack.bind(this);

    this.state = {loaded: false, chartData: null};
  }

  basicDates = {
    from: new Date(2019, 2, 24),
    to : new Date(2019, 2, 30)
  };

  toCompareDates = {
    from: new Date(2019, 2, 24),
    to: new Date(2019, 2, 30)
  };

  basicChartData = [];
  toCompareChartData = [];

  basicDateText = "24.03 - 30.03";
  toCompareDateText = "24.03 - 30.03";
  compared = false;

  async requestData(from, to, isBasicChart) {
    this.setState({loaded: false, chartData: []});

    let result = await RESTCalls.requestPowerConsumptionCyclesPerWeek("diakoniestation_kirchheim_teck", "24h", from, to);
    let formattedResult = this.createDataFromResponse(result);

    if(isBasicChart) {
      this.basicDateText = this.createChartText(this.basicDates);
      this.basicChartData = formattedResult;
      this.basicDates.from = from;
      this.basicDates.to = to;
    } else {
      this.toCompareDateText = this.createChartText(this.toCompareDates);
      this.toCompareChartData = formattedResult;
      this.toCompareDates.from = from;
      this.toCompareDates.to = to;
    }

    let chartData = [];

    if(this.compared) {
      chartData = [
        {
          "id": this.basicDateText,
          "color": "hsl(141, 70%, 50%)",
          "data": this.basicChartData
        },
        {
          "id": this.toCompareDateText,
          "color": "hsl(53, 70%, 50%)",
          "data": this.toCompareChartData
        }
      ];

    } else {
      chartData = [{
        "id": this.basicDateText ,
        "color": "hsl(141, 70%, 50%)",
        "data": this.basicChartData
      }];
    }

    this.setState({loaded: true, chartData: chartData});
  }

  createChartText(dates) {
    let from = dates.from;
    let to = dates.to;

    return Utils.createDayMonthText(from) + " - " + Utils.createDayMonthText(to);
  }

  createDataFromResponse(response) {
    let result = [];

    for(let i=0 ; i<7 ; i++) {
      var xVal = "Tag " + (i+1);

      if(response == null) {
        result[i] = {"x": xVal, "y": -1};
      } else {
        if(response.numbs[i].toString().includes("}undefined")) {
          result[i] = {"x" : xVal , "y" : response.numbs[i].toString().replace("}undefined", "")};
        } else {
          result[i] = {"x" : xVal , "y" : response.numbs[i]};
        }
      }
    }

    return result;
  }

  createData() {
    if(this.state.loaded) {
      if(this.basicChartData[0].y === -1 && this.toCompareChartData.length <= 0) {
        return <DashboardSnackBar />
      } else {
        if(this.state.loaded) {
          return <LoadingCycleWeeklyChart data={this.state.chartData}/>
        } else {
          return <CenterChartLoader/>
        }
      }
    }
  }

  createYearText(dates) {
    let from = Utils.createDayMonthText(dates.from) + "." + dates.from.getFullYear();
    let to = Utils.createDayMonthText(dates.to) + "." + dates.to.getFullYear();

    if(to.includes(".119")) {
      to = to.replace(".119", ".2019");
    }

    if(to.includes(".120")) {
      to = to.replace(".120", ".2020");
    }

    return from + " - " + to;
  }

  getTitle() {
    let titleText;

    if(this.compared) {
      titleText = (
        <Typography variant="h5" component="h3" style={{paddingLeft:"20px"}}>
          Vergleich der Ladezyklen zwischen: {this.createYearText(this.basicDates)} und {this.createYearText(this.toCompareDates)}
        </Typography>
      );
    } else {
      titleText = (
        <Typography variant="h5" component="h3" style={{paddingLeft:"20px"}}>
          Ladezyklen der Woche: {this.createYearText(this.basicDates)}
        </Typography>
      )
    }
    return (
      <div style={{width: "100%"}}>
        <h3>
          {titleText}
        </h3>
      </div>
    );
  }

  render() {
    return(
      <Fragment>
        <Paper className={this.props.classes} style={{padding:'20px'}}>
          {this.state.loaded ? this.getTitle() : <div/>}
          {this.getPickers()}
          {this.createData()}
          {this.getChangeTimeArrowButtons()}
        </Paper>
      </Fragment>

    );
  }

  async componentDidMount() {
    await this.requestData(this.basicDates.from, this.basicDates.to, true);
  }

  // Left picker
  async basicWeekChangeCallBack(from, to) {
    this.basicDates.from = from;
    this.basicDates.to = to;

    await this.requestData(from, to, true);
  }

  // Right picker
  async toCompareWeekChangeCallBack(from, to) {
    this.compared = true;
    this.toCompareDates.from = from;
    this.toCompareDates.to = to;

    await this.requestData(from, to, false);
  }

  getPickers() {
    return(
      <div style={{display: "flex"}}>
        <div style={{float: "left", display: "inline-block", paddingLeft: "20px"}}>
          <WeekPicker date={new Date("2019-3-24")} weekChangeCallback={this.basicWeekChangeCallBack} text={"Wochenstart auswählen"}/>
        </div>
        <div style={{float: "left", display: "inline-block", paddingLeft: "45%"}}>
          <WeekPicker date={new Date("2019-3-24")} weekChangeCallback={this.toCompareWeekChangeCallBack} text={"Vergleichen mit"}/>
        </div>
      </div>
    );
  }

  getChangeTimeArrowButtons() {
    return(
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Button variant="contained" color="primary" onClick={async () => {await this.handleButtonClick(-3); }}>
                {"<<<"}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" color="primary" onClick={async () => {await this.handleButtonClick(-2); }}>
                {"<<"}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" color="primary" onClick={async () => {await this.handleButtonClick(-1); }}>
                {"<"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
        </Grid>
        <Grid item xs={3}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Button variant="contained" color="primary" onClick={async () => {await this.handleButtonClick(1); }}>
                {">"}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" color="primary" onClick={async () => {await this.handleButtonClick(2); }}>
                {">>"}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" color="primary" onClick={async () => {await this.handleButtonClick(3); }}>
                {">>>"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  async handleButtonClick(numb) {
    if(this.dateTwoEnd == null ||this.dateTwoStart == null) {
      this.dateTwoEnd = new Date(this.basicDates.to.getFullYear(), this.basicDates.to.getMonth(), this.basicDates.to.getDate());
      this.dateTwoStart = new Date(this.basicDates.from.getFullYear(), this.basicDates.from.getMonth(), this.basicDates.from.getDate());
    }

    if(numb < 0) {
      numb = numb*-1;
      this.dateTwoStart = new Date(this.dateTwoStart.getFullYear(), this.dateTwoStart.getMonth(), this.dateTwoStart.getDate() - (7*numb));
      this.dateTwoEnd = new Date(this.dateTwoEnd.getFullYear(), this.dateTwoEnd.getMonth(), this.dateTwoEnd.getDate() - (7*numb));
    } else {
      this.dateTwoStart = new Date(this.dateTwoStart.getFullYear(), this.dateTwoStart.getMonth(), this.dateTwoStart.getDate() + (7*numb));
      this.dateTwoEnd = new Date(this.dateTwoEnd.getFullYear(), this.dateTwoEnd.getMonth(), this.dateTwoEnd.getDate() + (7*numb));
    }

    await this.requestData(this.dateTwoStart, this.dateTwoEnd, true);
  }
}
export default LoadingCycleWeeklyView