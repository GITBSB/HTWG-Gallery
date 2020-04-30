import React, {Component} from "react";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import deLocal from "date-fns/locale/de";

class DatePicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date: new Date("2019-06-28"),
      locale : "de"
    };

    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({date: e});
    this.props.dateChangeCallback(e);
  }
  render () {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocal}>
            <KeyboardDatePicker
              disableToolbar
              autoOk="true"
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              defaultValue={this.props.defaultValue != null ? this.props.defaultValue : "2019-06-28"}
              id="date-picker-inline"
              label="Tag auswählen"
              value={this.state.date}
              onChange={this.handleChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
        </MuiPickersUtilsProvider>
    )
  }
}
export default DatePicker