import React from 'react'
import Paper from "@material-ui/core/Paper/Paper";
import DayPicker from "../../../commons/pickers/DayPicker";
import LoadingPointsDailyChart from "../../../charts/flottenmanager/loadingpoints/LoadingPointsDailyChart";
import RESTCalls from '../../../commons/rest/RESTCalls'
import CenterChartLoader from '../../../commons/rest/CenterChartLoader'
import ChargingPointSelect from '../../../commons/dropdowns/ChargingPointSelect'
import Typography from '@material-ui/core/Typography'

function createDateString(date) {
  var dayNumb = getNumbFromDate(date.getDate());
  var monthNumb = getNumbFromDate(date.getMonth() + 1);
  var yearNumb = date.getFullYear().toString();

  var result = yearNumb + "-" +  monthNumb+ "-" + dayNumb

  if(result.includes("119-")) {
    result = result.replace("2019-");
  }

  if(result.includes("120-")) {
    result = result.replace("2020-");
  }

  return result;
}

function getNumbFromDate(numb) {
  var result = "";

  if(numb < 10) {
    result += "0" + numb;
  } else {
    result = numb;
  }
  return result;
}

class LoadingPointsDailyView extends React.Component {

  constructor(props) {
    super(props);

    var startDate = new Date(2019, 7, 5);

    if(this.props.loadingPointsDailyDate != null) {
      startDate = this.props.loadingPointsDailyDate;
      console.log("Updated ot: " + startDate);
    }

    this.state = {
      loaded: false,
      date: startDate,
      point: 5,
      points: []
    };

    this.changeDayCallback = this.changeDayCallback.bind(this);
    this.changePointCallback = this.changePointCallback.bind(this);
  }

  getFormattedDate() {
    var result = this.state.date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if(result.includes(" 119")) {
      result = result.replace(" 119", " 2019");
    }

    if(result.includes(" 120")) {
      result = result.replace(" 120", " 2020");
    }

    return result;
  }

  async changeDayCallback (date) {
    this.setState({ date: date });
    await this.requestData();
  }

  async changePointCallback(point) {
    this.setState({ point: point });
    await this.requestActiveChargingPoint(point);
  }

  render () {

    return (

      <Paper className={this.props.classes} style={{padding:'20px'}}>
        <Typography variant="h5" component="h3" style={{paddingTop:"20px" , paddingLeft:"20px"}}>
          Aktive Ladepunkte am {this.getFormattedDate()}
        </Typography>

        <div style={{float: "left", paddingLeft: "3%", paddingTop: "3%"}}>
          <DayPicker changeDayCallback={this.changeDayCallback} defaultValue={this.state.date}/>
        </div>
        <div style={{float: "right", paddingLeft: "3%", paddingTop: "4%"}}>
          <ChargingPointSelect data={this.state.points} changePointCallback={this.changePointCallback}/>
        </div>
        <h3 style={{textAlign: "center", paddingTop: "10%"}}></h3>
        <div style={{"height": "350px"}} >
          { this.state.loaded ? <LoadingPointsDailyChart data={this.state.data}/> : <CenterChartLoader/> }
        </div>
      </Paper>
    )
  }
  async componentDidMount() {
    await this.requestData();
  }

  async requestData() {
    let resultPoints = await RESTCalls.requestAvailableChargingPoints("diakoniestation_kirchheim_teck", createDateString(this.state.date));
    if(resultPoints != null) {
      this.setState({ points: resultPoints });
      this.setState({ point: resultPoints[0] })
    } else {
      this.setState({ points: [] });
      this.setState({ point: "" })
    }

    this.requestActiveChargingPoint( this.state.point)
  }

  async requestActiveChargingPoint(point) {
    let result = await RESTCalls.requestActiveChargingPointForDailyChart("diakoniestation_kirchheim_teck", createDateString(this.state.date), point);
    
    console.log(result);

    this.setState({data: result});
    this.setState({loaded: true});
  }
}

export default LoadingPointsDailyView