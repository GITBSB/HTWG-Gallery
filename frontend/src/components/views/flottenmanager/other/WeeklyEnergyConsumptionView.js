import React, { Fragment } from 'react'
import Paper from "@material-ui/core/Paper/Paper";
import WeekPicker from "../../../commons/pickers/WeekPicker";
import WeeklyEnergyConsumptionChart from "../../../charts/flottenmanager/other/WeeklyEnergyConsumptionChart";
import CenterChartLoader from "../../../commons/rest/CenterChartLoader";
import RESTCalls from "../../../commons/rest/RESTCalls";
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'
import DashboardSnackBar from "../../../commons/rest/DashboardSnackBar";
import Utils from "../../../commons/Utils";

class WeeklyEnergyConsumptionView extends React.Component {

  from = new Date(2019, 5, 12);
  to = new Date(2019, 5, 18);
  kwh = null;
  days = null;
  dataFound = false;
  
  constructor(props) {
    super(props);

    this.isCallback = true;
    this.state = {loading :  true};

    this.weekChangeCallback = this.weekChangeCallback.bind(this);
  }

  async componentDidMount() {
    this.setState({loading: true});
    await this.requestData(this.from, this.to);
  }

  async requestData(from, to) {
    this.setState({loading : true});

    let res = await RESTCalls.requestPowerConsumptionCumulativeDay("diakoniestation_kirchheim_teck", from, "7d");
    let sumWeek = await RESTCalls.requestPowerConsumptionCumulativeWeek("diakoniestation_kirchheim_teck", from, "6d");
    var sum = -1;
    var days = [];
    var numbs = [];

    days[0] = Utils.createDayMonthText(from);

    for(var i=1 ; i<7 ; i++) {
      days[i] = Utils.createDayMonthText(new Date(from.getYear(), from.getMonth(), from.getDate() + i));
    }

    var dataFound = false;

    if(res != null) {
      numbs = res.numbs;
      sum = this.calcKwhSum(res.numbs);
      dataFound = true;
    } else {
      numbs[0] = -1;
      numbs[1] = -1;
      numbs[2] = -1;
      numbs[3] = -1;
      numbs[4] = -1;
      numbs[5] = -1;
      numbs[6] = -1;
      sum = -1;
      sumWeek = -1;
    }

    var sumTxt = sum.toFixed(3).toString();

    this.kwh = numbs;
    this.days = days;
    this.sum = "Total: " + sumTxt;
    this.to = to;
    this.from = from;
    this.dataFound = dataFound;
    this.sumWeek = sumWeek;

    this.setState({loading: false});
  }

  calcKwhSum(kwH) {
    var result = 0;

    for(var i=0 ; i<kwH.length ; i++) {
      if(kwH[i].includes("-1")) {
        result += 0
      } else {
        result += parseFloat(kwH[i]);
      }
    }

    return result;
  }

  isCallback = false;

  async weekChangeCallback(from, to) {
    this.from = from;
    this.to = to;

    await this.requestData(from, to);
  }

  getTitle() {
    let fromText = "";
    let toText = "";

    if(!this.isCallback) {
      fromText = this.toDateText(this.from);
      toText = this.toDateText(this.to);
    } else {
      fromText = this.toCallbackText(this.from);
      toText = this.toCallbackText(this.to);
    }

    if(toText.includes(".119")) {
      toText = toText.replace(".119", ".2019");
    }

    if(toText.includes(".120")) {
      toText = toText.replace(".120", ".2020");
    }

    return "Energieverbrauch für den Zeitraum " + fromText + " - " + toText;
  }

  toCallbackText(date) {
    var result = "";

    if(date.getDate() < 10) {
      result += "0";
    }

    result += date.getDate() + ".";

    if(date.getMonth() < 10) {
      result += "0";
    }

    result += (date.getMonth()+1) + "." + (date.getFullYear());

    return result;
  }

  toDateText(date) {
    var result = "";

    if(date.getDate() < 10) {
      result += "0";
    }

    result += date.getDate() + ".";

    if(date.getMonth() < 10) {
      result += "0";
    }

    result += (date.getMonth()+1) + ".";

    var year = date.getYear().toString().substr(1);

    result += "20" + year;

    return result;
  }

  createSumWeekContainer() {
    return (
      <div style = {{float: "right" , marginTop: "10px"}}>
        <TextField id="outlined-start-adornment"
                   value = {this.sumWeek}
                   InputProps={{startAdornment: <InputAdornment position="start"><b>Total: </b></InputAdornment>,endAdornment: <InputAdornment position="end">KwH</InputAdornment>, readOnly: true,}}
                   variant="outlined"
        />
      </div>
    );
  }

  createContent() {
    if(this.state.loading) {
      return <CenterChartLoader/>;
    } else {
      if(this.dataFound) {
        return <WeeklyEnergyConsumptionChart days={this.days} kwH={this.kwh}/>;
      } else {
        return <DashboardSnackBar />
      }
    }
  }

  render () {
    return (
      <Fragment>
        <Paper className={this.props.classes} style={{padding:'20px'}}>
          <Typography variant="h5" component="h3" style={{paddingTop:"20px" , paddingLeft:"20px"}}>
            {this.getTitle()}
          </Typography>
          <div style={{ paddingLeft:"20px" , paddingTop:"20px"}}>
            <WeekPicker date={this.from} weekChangeCallback={this.weekChangeCallback} text={"Starttag auswählen"}/>
          </div>
          <div style={{"height": "350px"}} >
            {this.createContent()}
          </div>
          </Paper>
        {this.sumWeek == -1 ? <div /> : this.createSumWeekContainer()}
      </Fragment>
    )
  }
}

export default WeeklyEnergyConsumptionView