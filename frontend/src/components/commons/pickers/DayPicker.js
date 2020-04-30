import React, {Component} from "react";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Paper from "@material-ui/core/Paper/Paper";
import Grid from "@material-ui/core/Grid/Grid";
import deLocal from "date-fns/locale/de";

class WeekPicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date: new Date(2019, 7, 5),
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({date: e});
    this.props.changeDayCallback(e);
  }

  getDateFromProps() {
    var tmp = this.props.defaultValue;

    var year = tmp.getFullYear();
    if(year.toString().includes("119")) {
      year = 2019;
    }

    if(year.toString().includes("120")) {
      year = 2020;
    }

    return new Date(year, tmp.getMonth(), tmp.getDate());
  }

  render () {
    return (
      <div >
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocal}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              autoOk="true"
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label={"Tag auswählen"}
              value={this.props.defaultValue != null ? this.getDateFromProps() : "2019-06-28"}
              onChange={this.handleChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </div>
    )
  }
}

export default WeekPicker