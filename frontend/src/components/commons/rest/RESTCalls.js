import {Component} from "react";

class RESTCalls extends Component {

  static async requestActiveChargingpointsWeekCount(customer, interval, to, from) {
    from = RESTCalls.dateToUrl(from);
    to = RESTCalls.dateToUrl(to);

    var url = "/flottenmanager/" + customer + "/" +
      "activeChargingpointsWeek?interval=" + interval +
      "&weekEnd=" + to + "&weekStart=" + from;

    try {
      let response = await fetch(url);

      if (response.status === 200) {
        const json = await response.json();

        var jsonString = await JSON.stringify(json);

        return RESTCalls.parsePowerConsumptionCyclesPerWeek(jsonString, false);
      }
    } catch (error) {
      console.log("Error: " + error);
      return null;
    }

    return null;
  }

  static async requestPowerConsumptionCumulativeDay(customer, date, range) {
    date = RESTCalls.dateToUrl(date);

    var url = "/flottenmanager/" + customer + "/" +
      "powerConsumptionDayCumulativeKWh?dateFrom=" + date + "" +
      "&range=" + range;

    try {
      let response = await fetch(url);

      if (response.status === 200) {
        const json = await response.json();

        var jsonString = await JSON.stringify(json);

        return RESTCalls.parsePowerConsumptionCyclesPerWeek(jsonString, true);
      }
    } catch (error) {
      console.log("Error: " + error);
    }

    return null;
  }

  static async requestPowerConsumptionCumulativeWeek(customer, date, range) {
      date = RESTCalls.dateToUrl(date);

      var url = "/flottenmanager/" + customer + "/" +
        "powerConsumptionWeekCumulativeKWh?dateFrom=" + date + "" +
        "&range=" + range;

      try {
        let response = await fetch(url);

        if (response.status === 200) {
          const json = await response.json();

          var jsonString = await JSON.stringify(json);
          var obj = JSON.parse(jsonString);
          return obj.sum;
        }
      } catch (error) {
        console.log("Error: " + error);
      }

      return null;
    }

  static async requestPowerConsumptionCyclesPerWeek(customer, interval, from, to) {
    from = RESTCalls.dateToUrl(from);
    to = RESTCalls.dateToUrl(to);

    var url = "/flottenmanager/" + customer + "/" +
      "powerConsumptionCyclesPerWeek?interval=" + interval + "" +
      "&weekEnd=" + to + "&weekStart=" + from;

    try {
      let response = await fetch(url);

      if (response.status === 200) {
        const json = await response.json();

        var jsonString = await JSON.stringify(json);

        return RESTCalls.parsePowerConsumptionCyclesPerWeek(jsonString, false);
      }
    } catch (error) {
      console.log("Error: " + error);
    }

    return null;
  }

  static async requestPowerConsumptionFromToday(customer) {
    let url = "/flottenmanager/" + customer + "/power_consumption/ampere/1d";

    try {
      let fetchResult = await fetch(url);
      let jsonData = await fetchResult.json();
      let data = jsonData.results[0].series[0].values;

      return data.map((index) =>
        this.createLoadingData(index[0], index[1])
      );
    } catch (error) {
      return null;
    }
  }

  static async requestPowerConsumptionForDailyChart(customer, date) {

    let url = "/flottenmanager/" + customer + "/powerConsumptionDayWatt?date="+ date + "&interval=60m";
    console.log(url)

    try {
      let fetchResult = await fetch(url);
      let jsonData = await fetchResult.json();
      let data = jsonData.results[0].series[0].values;

      let formatedData =  data.map((index) =>
        this.createDailyChartData(index[0], index[1])
      );

      formatedData.pop()

      console.log(formatedData)

      let response = [
        {
          id : "Ladezyklus",
          data : formatedData
        }
      ]
      return response;
    } catch (error) {
      return null;
    }
  }

  static async requestPowerConsumption(customer, period) {
    let url = "/api/" + customer + "/power_consumption/ampere/" + period;

    try {
      let fetchResult = await fetch(url);
      let jsonData = await fetchResult.json();
      let data = jsonData.results[0].series[0].values;

      return data.map((index) =>
        this.createLoadingData(index[0], index[1])
      );
    } catch (error) {
      return null;
    }
  }

  static createLoadingData(timeStamp, amount) {
    let date = new Date(timeStamp)
    const time = (date.getHours())+ ':' + date.getMinutes() +" Uhr"
    return {time, amount};
  }

  static createDailyChartData(timeStamp, amount) {
    let date = new Date(timeStamp)
    date.setHours(date.getHours() -2)
    const time = ("0" + date.getHours()).slice(-2)+ ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();

    let response = {
      x: time,
      y: amount.toFixed(2)
    }
    return response;
  }

  static async requestActiveChargingPoint(customer, period, point) {
    let url = "/api/" + customer + "/charging_point/" + point + "/" + period;

    try {
      let fetchResult = await fetch(url);
      let jsonData = await fetchResult.json();
      let data = jsonData.results[0].series[0].values;

      return data.map((index) =>
        createChargingPointData(index[0], index[1])
      );
    } catch (error) {
      return null;
    }

    // Nested function to avoid public access..
    function createChargingPointData(timeStamp, enabled) {
      let date = new Date(timeStamp)
      const time = date.getHours() + ':' + date.getSeconds()
      enabled = enabled ? 1 : 0;
      return {time, enabled};
    }
  }

  static async requestAvailableChargingPoints(customer, day) {
    let url = "/flottenmanager/" + customer + "/activeChargingPoints/?date=" + day;

    try {
      let fetchResult = await fetch(url);
      let jsonData = await fetchResult.json();
      let data = jsonData.chargingpointActive;

      return data;
    } catch (error) {
      return null;
    }
  }

  static async requestActiveChargingPointForDailyChart(customer, day, point) {
    let url = "/flottenmanager/" + customer + "/chargingPointActiveDay/" + point + "/?date="+day;

    try {
      let fetchResult = await fetch(url);
      let jsonData = await fetchResult.json();
      let data = jsonData.chargingpointActive

      let formatedData =  data.map((index) =>
        createChargingPointData(index[0], index[1])
      );

      return formatedData;
    } catch (error) {
      return null;
    }

    // Nested function to avoid public access..
    function createChargingPointData(x, y) {
      y = y ? 1 : 0;
      x = new Date(x);
      x.setHours(x.getHours() - 2)
      return {x , y};
    }
  }

  static dateToUrl(date) {
    var year = "";

    if(date.getFullYear() < 200) {
      year = "20" + date.getFullYear().toString().substr(1);
    } else {
      year = date.getFullYear().toString();
    }

    var day = "";
    var month = "";

    // Monhts are zero indexed..
    if(date.getMonth()+1 < 10) {
      month = "0" + (date.getMonth()+1);
    } else {
      month = (date.getMonth() +1).toString();
    }

    if(date.getDate() < 10) {
      day = "0" + date.getDate();
    } else {
      day = date.getDate().toString();
    }

    return year + "-" + month + "-" + day;
  }

  static parsePowerConsumptionCyclesPerWeek(jsonString, isBarchart) {
    var dates = [];
    var numbs = [];

    for(var i=0 ; i<jsonString.length ; i++) {
      if(jsonString[i] == "\"") {
        var date = "";
        while(jsonString[i+1] != "\"" && i<jsonString.length) {
          date += jsonString[i+1];
          i++;
        }

        i = i+2;

        var numb = "";

        while(jsonString[i+1] != "," && i<jsonString.length) {
          numb += jsonString[i+1];
          i++;
        }

        if(numb.toString().includes("null")) {
          numb = "-1"
        }

        if(isBarchart) {
          if (numb.includes("}undefined")) {
            break;
          }
        }

        i++;

        dates.push(date);
        numbs.push(numb);
      }
    }

    return {
      dates: dates,
      numbs: numbs
    }
  }

  static async requestCompanies() {
    let url = "/api/customers";

    try {
      let fetchResult = await fetch(url);
      let jsonData = await fetchResult.json();

      let companies = jsonData.results[0].series[0].values;

      return companies;
    } catch (error) {
      return null;
    }
  }
}

export default RESTCalls