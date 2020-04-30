import React from "react";
import BarChart from "recharts/es6/chart/BarChart";
import CartesianGrid from "recharts/es6/cartesian/CartesianGrid";
import XAxis from "recharts/es6/cartesian/XAxis";
import YAxis from "recharts/es6/cartesian/YAxis";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Legend from "recharts/es6/component/Legend";
import Bar from "recharts/es6/cartesian/Bar";
import Label from "recharts/es6/component/Label";
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";
import Title from "../../views/flottenmanager/other/Titel";
import DashboardSnackBar from "../../commons/rest/DashboardSnackBar";
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";

class LoadingPointBarChart extends React.Component {

  constructor (props) {
    super(props)
  }

  render() {
    return (
      this.props.data == null ? <DashboardSnackBar /> : this.createChart()
    );
  }

  createChart() {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Paper style={{padding: '20px', display: 'flex', overflow: 'auto',
              flexDirection: 'column', height: '300px'}}>
              <React.Fragment>
                <Title>Today</Title>
                  <ResponsiveContainer>
                    <BarChart data={this.props.data}
                              margin={{top: 16, right: 16, bottom: 0, left: 24}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="time"/>
                    <YAxis>
                      <Label name="Charging point 4" dataKey="enabled" angle={270} position="left"
                               style={{textAnchor: 'middle'}}>Enabled</Label>
                    </YAxis>
                    <Tooltip/>
                    <Legend/>
                    <Bar name="Charging point 5" dataKey="enabled" fill="#8bc34a"/>
                  </BarChart>
                </ResponsiveContainer>
              </React.Fragment>
            </Paper>
          </Grid>
        </Grid>
      </div>)
  }
}

export default LoadingPointBarChart