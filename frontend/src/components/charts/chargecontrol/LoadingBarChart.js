import React from "react";
import CartesianGrid from "recharts/es6/cartesian/CartesianGrid";
import XAxis from "recharts/es6/cartesian/XAxis";
import YAxis from "recharts/es6/cartesian/YAxis";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Label from "recharts/es6/component/Label";
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";
import DashboardSnackBar from "../../commons/rest/DashboardSnackBar";
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import AreaChart from "recharts/es6/chart/AreaChart";
import Area from "recharts/es6/cartesian/Area";

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
                <ResponsiveContainer>
                  <AreaChart data={this.props.data}
                             margin={{top: 16, right: 16, bottom: 0, left: 24}}>
                    <XAxis dataKey="time" >
                    </XAxis>
                    <YAxis>
                      <Label dataKey="amount" angle={270} position="left" style={{ textAnchor: 'middle' }}>Amper</Label>
                    </YAxis>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Area type='monotone' dataKey='amount' stroke='#616161' fill='#8bc34a' />
                    <Tooltip/>
                  </AreaChart>
                </ResponsiveContainer>
              </React.Fragment>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default LoadingPointBarChart