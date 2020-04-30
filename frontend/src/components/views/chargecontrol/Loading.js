import React from 'react'
import CustomerSelect from "../../commons/dropdowns/CustomerSelect";
import LoadingBarChart from "../../charts/chargecontrol/LoadingBarChart";
import CenterChartLoader from "../../commons/rest/CenterChartLoader";
import TimeSlider from "../../commons/other/Timeslider";
import RESTCalls from "../../commons/rest/RESTCalls";

class Loading extends React.Component {

  currentTime = "10m";

  constructor (props) {
    super(props);

    this.state = {
      loaded: false
    };

    this.timeChangeCallback = this.timeChangeCallback.bind(this);
  }

  async componentDidMount() {
    await this.requestData();
  }

  async requestData() {
    this.setState({loaded: false});
    let result = await RESTCalls.requestPowerConsumption("diakoniestation_kirchheim_teck", this.currentTime);

    this.setState({data: result});
    this.setState({loaded: true});
  }

  async timeChangeCallback(newValue) {
    switch(newValue) {
      case 0:  this.currentTime = "10m"; break;
      case 1:  this.currentTime = "1d"; break;
      case 2:  this.currentTime = "1w"; break;
      case 3:  this.currentTime = "4w"; break;
      default: this.currentTime = "10m"; break;
    }
    await this.requestData();
  }

  render () {
    return (
      <div>
        <CustomerSelect />
        {this.state.loaded ? <LoadingBarChart data={this.state.data}/> : <CenterChartLoader/> }
        <TimeSlider timeChangeCallback={this.timeChangeCallback}/>
      </div>
    )
  }
}

export default Loading