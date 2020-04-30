import React from 'react'
import Paper from "@material-ui/core/Paper/Paper";
import Typography from '@material-ui/core/Typography'
import RESTCalls from '../../../commons/rest/RESTCalls'
import CenterChartLoader from '../../../commons/rest/CenterChartLoader'
import LoadingCycleDailyChart from '../../../charts/flottenmanager/loadingcycle/LoadingCycleDailyChart'
import DatePicker from '../../../commons/pickers/DatePicker'

class LoadingCycleDailyView extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      date : new Date(2019,5, 28)
    };
    this.dateChangeCallback = this.dateChangeCallback.bind(this);
  }

  async dateChangeCallback(e){
    this.requestData(e);
  }

  render () {
    return (
      <Paper className={this.props.classes} style={{padding:'20px'}}>
        <Typography variant="h5" component="h3" style={{paddingTop:"20px" , paddingLeft:"20px"}}>
          Ladezyklen des Tages {this.state.date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
        <div style={{ paddingLeft:"20px" , paddingTop:"20px"}}>
          <DatePicker dateChangeCallback={this.dateChangeCallback}/>
        </div>
        {this.state.loaded ? <LoadingCycleDailyChart data={this.state.data}/> : <CenterChartLoader/> }
      </Paper>
    )
  }
   async componentDidMount() {
    await this.requestData(this.state.date);
  }
  async requestData(e) {
    this.setState({loaded: false, date: e, data: null});
    if (this.state.date !== "")
    {
      let date = RESTCalls.dateToUrl(e)
      let result = await RESTCalls.requestPowerConsumptionForDailyChart("diakoniestation_kirchheim_teck",date);
      this.setState({data: result, loaded: true, date: e});
    }
  }
}

export default LoadingCycleDailyView