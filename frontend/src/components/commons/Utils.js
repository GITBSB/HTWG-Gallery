import {Component} from "react";

class Utils extends Component {

  static createDayMonthText(date) {
    let result = "";

    if(date.getDate() < 10) {
      result += "0" + date.getDate();
    } else {
      result += date.getDate();
    }

    result += ".";

    if(date.getMonth()+1 < 10) {
      result += "0" + (date.getMonth()+1);
    } else {
      result += (date.getMonth()+1);
    }

    return result;
  }

}

export default Utils