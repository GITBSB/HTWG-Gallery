package de.example.flottenmanager.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import de.example.db.InfluxDBService;
import de.example.flottenmanager.service.FlottenmanagerService;
import org.influxdb.dto.QueryResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
@RestController()
@RequestMapping("/flottenmanager/")
public class FlottenmanagerController {

    @Autowired
    private InfluxDBService influxDBService;

    private FlottenmanagerService flottenmanagerService = new FlottenmanagerService();

    @GetMapping("/{customer}/activeChargingpointsWeek")
    public String activeLoadingpointsWeekCount( @PathVariable("customer") String dbName,
                                                @RequestParam("weekStart") String weekStart,
                                                @RequestParam("weekEnd") String weekEnd,
                                                @RequestParam(value = "interval", required = false, defaultValue = "1d") String interval) {
        QueryResult queryResult = influxDBService.query(dbName, String.format("\n" +
                        "SELECT COUNT(DISTINCT(enabled)) FROM chargingpoint WHERE time >= '%s' AND time <= '%s' AND enabled = true AND hostname = 'chargecontrol_diakoniestation_kirchheim_teck' group by time(%s), chargepoint",
                weekStart, weekEnd,
                interval));
        return flottenmanagerService.getAmountEnabledPerDay(queryResult);
    }

    @GetMapping("/{customer}/powerConsumptionDayCumulativeKWh")
    public String powerConsumptionDayCumulativeKWh( @PathVariable("customer") String dbName,
                                                    @RequestParam("dateFrom") String dateFrom,
                                                    @RequestParam(value = "range", required = false, defaultValue = "6d") String range ) {
        QueryResult queryResult = influxDBService.query(dbName, String.format("SELECT mean(P_total) FROM currentmeasure WHERE time >= '%s' and time <= '%s' + %s group by time(1h)", dateFrom, dateFrom, range));

        return flottenmanagerService.provideJsonCumulativePowerKWhDay(queryResult);
    }


    @GetMapping("/{customer}/powerConsumptionWeekCumulativeKWh")
    public String powerConsumptionWeekCumulativeKWh( @PathVariable("customer") String dbName,
                                                     @RequestParam("dateFrom") String dateFrom,
                                                     @RequestParam(value = "range", required = false, defaultValue = "6d") String range ) {
        QueryResult queryResult = influxDBService.query(dbName, String.format("SELECT mean(P_total) FROM currentmeasure  WHERE time >= '%s' and time <= '%s' + %s group by time(1h)", dateFrom, dateFrom, range));
        return flottenmanagerService.provideJsonCumulativePowerKWhWeek(queryResult);
    }

    @GetMapping("/{customer}/powerConsumptionCyclesPerWeek")
    public String powerCyclesPerWeek( @PathVariable("customer") String dbName, @RequestParam("weekStart") String weekStart, @RequestParam("weekEnd") String weekEnd, @RequestParam(value = "interval", required = false, defaultValue = "5m") String interval) {
        QueryResult queryResult = influxDBService.query(dbName, String.format("SELECT mean(P_total) FROM currentmeasure WHERE time >= '%s' AND time <= '%s' GROUP BY time(%s)", weekStart, weekEnd, interval));
        return flottenmanagerService.parseJsonPowerPerWeek(queryResult);
    }

    @GetMapping("/{customer}/powerConsumptionDayWatt")
    public QueryResult powerConsumptionDayWatt(@PathVariable("customer") String dbName,
                                               @RequestParam("date") String date,
                                               @RequestParam(defaultValue = "5m") String interval) {
        return influxDBService.query(dbName, String.format("SELECT MEAN(P_total) FROM currentmeasure WHERE time >= '%s' and time < '%s' + 1d  group by time(%s)", date, date, interval));
    }


    @GetMapping("/{customer}/availableChargingPoints")
    public String availableChargingPoints(@PathVariable("customer") String dbName,
                                             @RequestParam("date") String date){
        QueryResult queryResult = influxDBService.query(dbName, String.format("SELECT distinct(id) from (select enabled, id from chargingpoint WHERE time >= '%s' - 100d and time < '%s')", date, date));
        return flottenmanagerService.provideAvailableChargingPoints(queryResult);
    }

    @GetMapping("/{customer}/chargingPointActiveDay/{id}/")
    public String chargingPointActiveDay(@PathVariable("customer") String dbName,
                                            @PathVariable("id") String id,
                                            @RequestParam("date") String date) {

        QueryResult queryResult =  influxDBService.query(dbName, String.format("SELECT time, id, enabled FROM chargingpoint WHERE id='%s' and time <= '%s' + 1d ORDER BY time DESC LIMIT 10", id, date));
        return flottenmanagerService.provideChargingPointDay(queryResult, date);
    }

    @GetMapping("/{customer}/activeChargingPoints")
    public String activeChargingPoints(@PathVariable("customer") String dbName,
                                          @RequestParam("date") String date){

        QueryResult queryResult = influxDBService.query(dbName, String.format("SELECT distinct(id) from (select enabled, id from chargingpoint WHERE time >= '%s' - 100d and time < '%s')", date, date));
        if(queryResult.getResults().get(0).getSeries() == null) {
            return null;
        }
        List<Integer> chargingPoints = flottenmanagerService.provideChargingPointsForActive(queryResult);

        System.out.println(chargingPoints.toString());

        List<Integer> activeCP = new ArrayList<>();
        for(int id : chargingPoints) {
            queryResult =  influxDBService.query(dbName, String.format("SELECT time, id, enabled FROM chargingpoint WHERE id='%s' and time <= '%s' + 1d ORDER BY time DESC LIMIT 10", id, date));
            if(flottenmanagerService.hasActivePointAtDate(queryResult, date)) {
                activeCP.add(id);
            }
        }

        Map<Object, Object> resultMap = new LinkedHashMap<>();
        resultMap.put("chargingpointActive", activeCP);
        System.out.println(resultMap);
        Gson gson = new GsonBuilder().create();
        return gson.toJson(resultMap);
    }
}
