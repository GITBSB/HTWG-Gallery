package de.example.flottenmanager.service;

import org.influxdb.dto.QueryResult;
import org.junit.Assert;
import org.junit.Test;
import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.google.gson.Gson;

import static org.junit.Assert.assertEquals;

public class FlottenmanagerServiceTest {
    FlottenmanagerService flottenmanagerService = new FlottenmanagerService();
    @Test
    public void provideCustomerNamesTest() {
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("name", "distinct"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("1970-01-01T00:00:00Z", 2), Arrays.asList("1970-01-01T00:00:00Z", 3), Arrays.asList("1970-01-01T00:00:00Z", 4)));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        String resultString = flottenmanagerService.provideAvailableChargingPoints(expectedQueryResult);
        Assert.assertEquals("{\"chargingpoints\":[2,3,4]}", resultString);
    }

    @Test
    public void provideChargingPointActiveDayTest() {
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("name", "distinct"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-06-17T16:07:50.005Z", 0, false), Arrays.asList("2019-06-17T16:06:00.094Z",0, true), Arrays.asList("2019-06-15T16:06:00.094Z",0, false)));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        String resultString = flottenmanagerService.provideChargingPointDay(expectedQueryResult, "2019-06-17");
        Assert.assertEquals("{\"chargingpointActive\":[[\"2019-06-17T23:59:00.00Z\",false],[\"2019-06-17T16:07:50.005Z\",false],[\"2019-06-17T16:06:00.094Z\",true],[\"2019-06-17T00:00:00.00Z\",false]]}", resultString);

        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-06-15T16:06:00.094Z",0, false)));
        resultString = flottenmanagerService.provideChargingPointDay(expectedQueryResult, "2019-06-17");
        Assert.assertEquals("{\"chargingpointActive\":[[\"2019-06-17T23:59:00.00Z\",false],[\"2019-06-17T00:00:00.00Z\",false]]}", resultString);
    }

    @Test
    public void provideChargingPointsForActiveTest() {
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("name", "distinct"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("1970-01-01T00:00:00Z", 2), Arrays.asList("1970-01-01T00:00:00Z", 3), Arrays.asList("1970-01-01T00:00:00Z", 4)));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        List<Integer> resultList = flottenmanagerService.provideChargingPointsForActive(expectedQueryResult);
        Assert.assertEquals(Arrays.asList(2, 3, 4), resultList);
    }

    @Test
    public void hasActivePointAtDateTest() {
        QueryResult queryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("name", "distinct"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-06-17T16:07:50.005Z", 0, false), Arrays.asList("2019-06-17T16:06:00.094Z", 0, true), Arrays.asList("2019-06-15T16:06:00.094Z", 0, false)));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        queryResult.setResults(Arrays.asList(expectedResult));

        Assert.assertEquals(true, flottenmanagerService.hasActivePointAtDate(queryResult, "2019-06-17"));

        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-06-15T16:06:00.094Z", 0, false)));
        Assert.assertEquals(false, flottenmanagerService.hasActivePointAtDate(queryResult, "2019-06-17"));
    }

    @Test
    public void provideJsonCumulativePowerKWhDayTest() {
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("time", "P_total"));
        expectedSeries.setValues(prepareValuesForQueryResult(Arrays.asList(20., 20., 20., 20., 20., 20., 20., 20., 20., 20., 40., 40., 40., 40., 40., 40., 40., 40., 40., 40., 60., 60., 60., 60.)));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));
        JsonObject json = new Gson().fromJson(flottenmanagerService.provideJsonCumulativePowerKWhDay(expectedQueryResult), JsonObject.class);
        System.out.println(json);
        assertEquals(0.84, json.get("date").getAsDouble(), 0);

        expectedSeries.setValues(prepareValuesForQueryResult(Arrays.asList(null, null, 20., 20., 20., 20., 20., 20., 20., 20., 40., 40., 40., 40., 40., 40., 40., 40., 40., 40., 60., 60., 60., 60.)));
        json = new Gson().fromJson(flottenmanagerService.provideJsonCumulativePowerKWhDay(expectedQueryResult), JsonObject.class);
        System.out.println(json);
        assertEquals(0.8, json.get("date").getAsDouble(), 0);

        expectedSeries.setValues(prepareValuesForQueryResult(Arrays.asList(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)));
        json = new Gson().fromJson(flottenmanagerService.provideJsonCumulativePowerKWhDay(expectedQueryResult), JsonObject.class);
        System.out.println(json);
        assertEquals("\"null\"", json.get("date").toString());
    }

    @Test
    public void provideJsonCumulativePowerKWhWeekTest() {
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setValues(prepareValuesForQueryResult(Arrays.asList(200.00)));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));
        JsonObject json = new Gson().fromJson(flottenmanagerService.provideJsonCumulativePowerKWhWeek(expectedQueryResult), JsonObject.class);
        assertEquals(0.200, json.get("sum").getAsDouble(), 3);
    }

    @Test
    public void parseJsonPowerPerWeekTest() {

        //build testResult
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();

        //Add Result params
        expectedSeries.setColumns(Arrays.asList("time", "P_total"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-06-28T00:00:00Z", 500.0),
            Arrays.asList("2019-06-29T00:00:00Z", 600.00),
            Arrays.asList("2019-06-30T00:00:00Z", null)));

        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        JsonObject json = new Gson().fromJson(flottenmanagerService.parseJsonPowerPerWeek(expectedQueryResult), JsonObject.class);

        assertEquals(500, json.get("2019-06-28T00:00:00Z").getAsDouble(), 0);
        assertEquals(600, json.get("2019-06-29T00:00:00Z").getAsDouble(), 0);
        assertEquals("0.0", json.get("2019-06-30T00:00:00Z").getAsString());
    }

    @Test
    public void prepareValuesForQueryResult() {
        assertEquals("[[date, 3.0], [date, 2.0]]", prepareValuesForQueryResult(Arrays.asList(3.0, 2.0)).toString());
    }

    private List<List<Object>> prepareValuesForQueryResult(List<Object> values) {
        List<List<Object>> list = new ArrayList<>();
        for (Object val : values) {
            List<Object> listInner = new ArrayList<>();
            listInner.add("date");
            listInner.add(val);
            list.add(listInner);
        }
        return list;
    }

    private List<List<Object>> setSumValues(List<Object> inputValues) {
        List<List<Object>> wrapperList = new ArrayList<>();
        List<Object> values = new ArrayList<>();
        values.add("sum");
        values.add(inputValues.get(1));
        System.out.println("values"+ values);
        wrapperList.add(values);
        return wrapperList;
    }
}
