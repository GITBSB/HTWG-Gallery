package de.example.controller;


import de.example.chargecontrol.ApiController;
import de.example.db.InfluxDBService;
import org.influxdb.dto.QueryResult;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(ApiController.class)
public class ApiControllerTest{

    @Value("${influxdb.dbname}")
    private String dbName;

    @Autowired
    private MockMvc mockMvc;

    private ApiController apiController = new ApiController();

    @MockBean
    private InfluxDBService influxDBService;

    @Test
    public void getTimeFromQueryResultTest() {
        QueryResult queryResult = new QueryResult();
        QueryResult.Result result = new QueryResult.Result();
        QueryResult.Series series = new QueryResult.Series();
        series.setColumns(Arrays.asList("time", "P_total"));
        series.setValues(Arrays.asList(Arrays.asList("2019-06-28T15:27:50.006Z", "230")));
        result.setSeries(Arrays.asList(series));
        queryResult.setResults(Arrays.asList(result));

        Assert.assertEquals(apiController.getTimeFromQueryResult(queryResult), "'2019-06-28T15:27:50.006Z'");

    }

    @Test
    public void powerConsumptionCurrentTest() throws Exception {
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("time", "P_total"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-06-28T15:27:50.006Z", "230")));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        when(influxDBService.query(dbName,"SELECT I_total, I_uom, P_total, P_uom FROM currentmeasure ORDER BY time DESC LIMIT 1")).thenReturn(expectedQueryResult);
        mockMvc.perform(get("/api/" + dbName + "/power_consumption/current"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].columns", is(Arrays.asList("time", "P_total"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[0]", is(Arrays.asList("2019-06-28T15:27:50.006Z", "230"))));
    }

    @Test
    public void powerConsumptionHistoryTest() throws Exception {
        QueryResult expectedQueryResult_first = new QueryResult();
        QueryResult.Result expectedResult_first = new QueryResult.Result();
        QueryResult.Series expectedSeries_first = new QueryResult.Series();
        expectedSeries_first.setColumns(Arrays.asList("time", "P_total"));
        expectedSeries_first.setValues(Arrays.asList(Arrays.asList("2019-06-28T15:27:50.006Z", "230")));
        expectedResult_first.setSeries(Arrays.asList(expectedSeries_first));
        expectedQueryResult_first.setResults(Arrays.asList(expectedResult_first));

        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("time", "P_total"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-06-28T15:27:50.006Z", "230"), (Arrays.asList("2019-07-28T15:27:50.006Z", "80"))));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        when(influxDBService.query(dbName, "SELECT I_total, I_uom, P_total, P_uom FROM currentmeasure ORDER BY time DESC LIMIT 1")).thenReturn(expectedQueryResult_first);
        when(influxDBService.query(dbName, "SELECT I_total, I_uom, P_total, P_uom FROM currentmeasure WHERE time > '2019-06-28T15:27:50.006Z' - 1h and time <= '2019-06-28T15:27:50.006Z'")).thenReturn(expectedQueryResult);
        mockMvc.perform(get("/api/" + dbName + "/power_consumption/1h"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].columns", is(Arrays.asList("time", "P_total"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[0]", is(Arrays.asList("2019-06-28T15:27:50.006Z", "230"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[1]", is(Arrays.asList("2019-07-28T15:27:50.006Z", "80"))));
    }

    @Test
    public void powerConsumption_Watt_HistoryWithIntervalTest() throws Exception {
        QueryResult expectedQueryResult_first = new QueryResult();
        QueryResult.Result expectedResult_first = new QueryResult.Result();
        QueryResult.Series expectedSeries_first = new QueryResult.Series();
        expectedSeries_first.setColumns(Arrays.asList("time", "P_total"));
        expectedSeries_first.setValues(Arrays.asList(Arrays.asList("2019-06-28T15:27:50.006Z", "230")));
        expectedResult_first.setSeries(Arrays.asList(expectedSeries_first));
        expectedQueryResult_first.setResults(Arrays.asList(expectedResult_first));

        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("time", "mean"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-06-28T15:10:00.000Z", "230"), (Arrays.asList("2019-06-28T15:20:00.000Z", "222"))));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        when(influxDBService.query(dbName, "SELECT I_total, I_uom, P_total, P_uom FROM currentmeasure ORDER BY time DESC LIMIT 1")).thenReturn(expectedQueryResult_first);
        when(influxDBService.query(dbName, "SELECT mean(P_total) FROM currentmeasure WHERE time > '2019-06-28T15:27:50.006Z' - 1h and time <= '2019-06-28T15:27:50.006Z' group by time(10m)")).thenReturn(expectedQueryResult);
        mockMvc.perform(get("/api/" + dbName + "/power_consumption/watt/1h"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].columns", is(Arrays.asList("time", "mean"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[0]", is(Arrays.asList("2019-06-28T15:10:00.000Z", "230"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[1]", is(Arrays.asList("2019-06-28T15:20:00.000Z", "222"))));
    }

    @Test
    public void powerConsumption_Ampere_HistoryWithIntervalTest() throws Exception {
        QueryResult expectedQueryResult_first = new QueryResult();
        QueryResult.Result expectedResult_first = new QueryResult.Result();
        QueryResult.Series expectedSeries_first = new QueryResult.Series();
        expectedSeries_first.setColumns(Arrays.asList("time", "P_total"));
        expectedSeries_first.setValues(Arrays.asList(Arrays.asList("2019-06-28T15:27:50.006Z", "230")));
        expectedResult_first.setSeries(Arrays.asList(expectedSeries_first));
        expectedQueryResult_first.setResults(Arrays.asList(expectedResult_first));

        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("time", "mean"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-06-28T15:00:00.000Z", "230"), (Arrays.asList("2019-06-28T15:20:00.000Z", "222"))));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        when(influxDBService.query(dbName, "SELECT I_total, I_uom, P_total, P_uom FROM currentmeasure ORDER BY time DESC LIMIT 1")).thenReturn(expectedQueryResult_first);
        when(influxDBService.query(dbName, "SELECT mean(P_total) FROM currentmeasure WHERE time > '2019-06-28T15:27:50.006Z' - 1h and time <= '2019-06-28T15:27:50.006Z' group by time(20m)")).thenReturn(expectedQueryResult);
        mockMvc.perform(get("/api/" + dbName + "/power_consumption/watt/1h?interval=20m"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].columns", is(Arrays.asList("time", "mean"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[0]", is(Arrays.asList("2019-06-28T15:00:00.000Z", "230"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[1]", is(Arrays.asList("2019-06-28T15:20:00.000Z", "222"))));
    }

    @Test
    public void chargingPointRecentTest() throws Exception {
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("time", "enabled", "id"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-06-28T15:27:50.006Z", true, "5")));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        when(influxDBService.query(dbName, "SELECT time, enabled, id FROM chargingpoint WHERE id = '5' ORDER BY time DESC LIMIT 1")).thenReturn(expectedQueryResult);
        mockMvc.perform(get("/api/" + dbName + "/charging_point/5/current"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].columns", is(Arrays.asList("time", "enabled", "id"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[0]", is(Arrays.asList("2019-06-28T15:27:50.006Z", true, "5"))));
    }

    @Test
    public void chargingPointHistoryTest() throws Exception {
        QueryResult expectedQueryResult_first = new QueryResult();
        QueryResult.Result expectedResult_first = new QueryResult.Result();
        QueryResult.Series expectedSeries_first = new QueryResult.Series();
        expectedSeries_first.setColumns(Arrays.asList("time", "enabled", "id"));
        expectedSeries_first.setValues(Arrays.asList(Arrays.asList("2019-03-28T11:26:55.006Z", false, "5")));
        expectedResult_first.setSeries(Arrays.asList(expectedSeries_first));
        expectedQueryResult_first.setResults(Arrays.asList(expectedResult_first));

        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("time", "enabled", "id"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-03-28T11:26:55.006Z", false, "5"), Arrays.asList("2019-04-18T10:16:55.006Z", true, "2")));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        when(influxDBService.query(dbName, "SELECT time, enabled, id FROM chargingpoint WHERE id = '5' ORDER BY time DESC LIMIT 1")).thenReturn(expectedQueryResult_first);
        when(influxDBService.query(dbName, "SELECT time, enabled, id FROM chargingpoint WHERE id = '5' and time > '2019-03-28T11:26:55.006Z' - 1h and time <= '2019-03-28T11:26:55.006Z'")).thenReturn(expectedQueryResult);
        mockMvc.perform(get("/api/" + dbName + "/charging_point/5/1h"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].columns", is(Arrays.asList("time", "enabled", "id"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[0]", is(Arrays.asList("2019-03-28T11:26:55.006Z", false, "5"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[1]", is(Arrays.asList("2019-04-18T10:16:55.006Z", true, "2"))));
    }

    @Test
    public void getCustomersTest() throws Exception {
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("name"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("Customer_one"), Arrays.asList("Customer_two"), Arrays.asList("Customer_three")));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        when(influxDBService.query("show databases")).thenReturn(expectedQueryResult);
        mockMvc.perform(get("/api/customers"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[0]", is(Arrays.asList("Customer_one"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[1]", is(Arrays.asList("Customer_two"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[2]", is(Arrays.asList("Customer_three"))));

    }
}
