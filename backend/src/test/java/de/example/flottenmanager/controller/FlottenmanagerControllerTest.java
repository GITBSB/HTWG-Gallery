package de.example.flottenmanager.controller;


import de.example.db.InfluxDBService;
import org.influxdb.dto.QueryResult;
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
@WebMvcTest(FlottenmanagerController.class)
public class FlottenmanagerControllerTest {
    @Value("${influxdb.dbname}")
    private String dbName;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InfluxDBService influxDBService;

    @Test
    public void powerConsumptionDayWattTest() throws Exception {
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("time", "P_total"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-03-28T00:00:00Z", 230), Arrays.asList("2019-03-28T00:05:00Z", 114)));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        when(influxDBService.query(dbName,"SELECT MEAN(P_total) FROM currentmeasure WHERE time >= '2019-03-28' and time < '2019-03-28' + 1d  group by time(5m)")).thenReturn(expectedQueryResult);
        mockMvc.perform(get("/flottenmanager/" + dbName + "/powerConsumptionDayWatt?date=2019-03-28"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].columns", is(Arrays.asList("time", "P_total"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[0]", is(Arrays.asList("2019-03-28T00:00:00Z", 230))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.results[0].series[0].values[1]", is(Arrays.asList("2019-03-28T00:05:00Z", 114))));
    }

    @Test
    public void availableChargingPointsTest() throws Exception {
        QueryResult expectedQueryResult = new QueryResult();
        QueryResult.Result expectedResult = new QueryResult.Result();
        QueryResult.Series expectedSeries = new QueryResult.Series();
        expectedSeries.setColumns(Arrays.asList("time", "P_total"));
        expectedSeries.setValues(Arrays.asList(Arrays.asList("2019-03-28T00:00:00Z", 2), Arrays.asList("2019-03-28T00:05:00Z", 3)));
        expectedResult.setSeries(Arrays.asList(expectedSeries));
        expectedQueryResult.setResults(Arrays.asList(expectedResult));

        when(influxDBService.query(dbName,"SELECT distinct(id) from (select enabled, id from chargingpoint WHERE time >= '2019-03-28' - 100d and time < '2019-03-28')")).thenReturn(expectedQueryResult);
        mockMvc.perform(get("/flottenmanager/" + dbName + "/availableChargingPoints?date=2019-03-28"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.chargingpoints", is(Arrays.asList(2,3))));
    }


}
