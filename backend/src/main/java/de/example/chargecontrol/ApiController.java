package de.example.chargecontrol;

import de.example.db.InfluxDBService;
import org.influxdb.dto.QueryResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/api/")
public class ApiController {

    @Autowired
    private InfluxDBService influxDBService;

    @GetMapping("/{customer}/power_consumption/current")
    public QueryResult powerConsumptionCurrent(@PathVariable("customer") String dbName) {
        return influxDBService.query(dbName, "SELECT I_total, I_uom, P_total, P_uom FROM currentmeasure ORDER BY time DESC LIMIT 1");
    }
    @GetMapping("/{customer}/power_consumption/{period}")
    public QueryResult powerConsumptionHistory(@PathVariable("customer") String dbName, @PathVariable("period") String period) {
        String timeOfRecentData = getTimeFromQueryResult(powerConsumptionCurrent(dbName));

        return influxDBService.query(dbName, String.format("SELECT I_total, I_uom, P_total, P_uom FROM currentmeasure WHERE time > %s - %s and time <= %s", timeOfRecentData, period, timeOfRecentData));
    }

    @GetMapping("/{customer}/power_consumption/ampere/{period}")
    public QueryResult powerConsumption_Ampere_HistoryWithInterval(@PathVariable("customer") String dbName, @PathVariable("period") String timeSpan, @RequestParam(defaultValue = "10m") String interval) {
        String timeOfRecentData = getTimeFromQueryResult(powerConsumptionCurrent(dbName));

        return influxDBService.query(dbName, String.format("SELECT mean(I_total) FROM currentmeasure WHERE time > %s - %s and time <= %s group by time(%s)",  timeOfRecentData, timeSpan, timeOfRecentData, interval));
    }

    @GetMapping("/{customer}/power_consumption/watt/{period}")
    public QueryResult powerConsumption_Watt_HistoryWithInterval(@PathVariable("customer") String dbName, @PathVariable("period") String timeSpan, @RequestParam(defaultValue = "10m") String interval) {
        String timeOfRecentData = getTimeFromQueryResult(powerConsumptionCurrent(dbName));

        return influxDBService.query(dbName, String.format("SELECT mean(P_total) FROM currentmeasure WHERE time > %s - %s and time <= %s group by time(%s)", timeOfRecentData, timeSpan, timeOfRecentData, interval));
    }

    @GetMapping("/{customer}/charging_point/{id}/current")
    public QueryResult chargingPointRecent(@PathVariable("customer") String dbName, @PathVariable("id") String id) {
        return influxDBService.query(dbName, "SELECT time, enabled, id FROM chargingpoint WHERE id = '" + id + "' ORDER BY time DESC LIMIT 1");
    }

    @GetMapping("/{customer}/charging_point/{id}/{period}")
    public QueryResult chargingPointHistory(@PathVariable("customer") String dbName, @PathVariable("id") String id, @PathVariable("period") String timeSpan) {
        QueryResult tmpResults = chargingPointRecent(dbName, id);
        String timeOfRecentData = getTimeFromQueryResult(tmpResults);

        return influxDBService.query(dbName, String.format("SELECT time, enabled, id FROM chargingpoint WHERE id = '%s' and time > %s - %s and time <= %s", id, timeOfRecentData, timeSpan, timeOfRecentData));
    }

    @GetMapping("/customers")
    public QueryResult getCustomers() {
        return influxDBService.query("show databases");
    }

    @PostMapping("/query")
    public QueryResult executeQuery(@RequestBody String query) {
        return influxDBService.query(query);
    }

    public String getTimeFromQueryResult(QueryResult queryResult) {
        return String.format("'%s'", queryResult.getResults().get(0).getSeries().get(0).getValues().get(0).get(0).toString());
    }
}