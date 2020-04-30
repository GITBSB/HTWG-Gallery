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
      date: props.date
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({date: e});

    let from = e;
    //let to = new Date();
    //to.setDate(from.getDate() + 6);
    let to = new Date(from.getYear(), from.getMonth(), from.getDate());
    to.setDate(to.getDate() + 6);

    this.props.weekChangeCallback(from, to);
  }

  render () {
    return (
      <div >
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocal}>
            <KeyboardDatePicker
              disableToolbar
              autoOk="true"
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label={this.props.text}
              value={this.state.date}
              onChange={this.handleChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
        </MuiPickersUtilsProvider>
      </div>
    )
  }
}

export default WeekPicker