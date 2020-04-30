package de.example.flottenmanager.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.influxdb.dto.QueryResult;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import de.example.util.UtilFunctions;
import java.math.BigDecimal;
import java.math.RoundingMode;

public class FlottenmanagerService {
    public String provideAvailableChargingPoints(QueryResult queryResult) {
        List<List<Object>> rawResult = queryResult.getResults().get(0).getSeries().get(0).getValues();
        List<Object> jsonList = new ArrayList<>();
        for (List<Object> list : rawResult) {
            jsonList.add(list.get(1));
        }
        Map<Object, Object> resultMap = new LinkedHashMap<>();
        resultMap.put("chargingpoints", jsonList);

        Gson gson = new GsonBuilder().create();
        return gson.toJson(resultMap);
    }

    public String getAmountEnabledPerDay(QueryResult result) {

        //(Day, Amount)
        Map<String, Double> resultMap = new LinkedHashMap<>();
        List<QueryResult.Series> series;

        if (result != null) {
            series = result.getResults().get(0).getSeries();
        } else {
            return null;
        }

        //chargingpoint -> values -> day/enabled
        for (QueryResult.Series serie : series) {
            //Serie = chargingpoint
            for (List<Object> values : serie.getValues()) {
                //Values = Day(Key) and Value = 1|0 (chargingpoint was enabled or not)
                if (!resultMap.containsKey(values.get(0))) {
                    //Add New Day-KeyValue
                    resultMap.put(values.get(0).toString(), Double.parseDouble(values.get(1).toString()));
                } else {
                    // get Key-> getValue -> Add +1
                    Double value = resultMap.get(values.get(0));
                    if (Double.parseDouble(values.get(1).toString()) == 1.0) { //if was enabled that Day
                        value += 1;
                        resultMap.put(values.get(0).toString(), value);
                    }
                }
            }
        }

        Gson gson = new GsonBuilder().create();
        return gson.toJson(resultMap);
    }

    public String provideChargingPointDay(QueryResult queryResult, String date) {
        List<List<Object>> rawResult = queryResult.getResults().get(0).getSeries().get(0).getValues();
        List<Object> jsonListOuter = new ArrayList<>();
        boolean first = true;

        List<Object> firstEntry = new ArrayList<>();
        firstEntry.add(date+"T23:59:00.00Z");

        for(List<Object> list : rawResult) {
            List<Object> jsonListInner = new ArrayList<>();

            if(jsonListOuter.isEmpty()) {
                firstEntry.add(list.get(2));
                jsonListOuter.add(firstEntry);
            }
            if(list.get(0).toString().contains(date)) {
                jsonListInner.add(list.get(0));
                jsonListInner.add(list.get(2));
                jsonListOuter.add(jsonListInner);

            } else {
                jsonListInner.add(date + "T00:00:00.00Z");
                jsonListInner.add(list.get(2));
                jsonListOuter.add(jsonListInner);
                break;
            }
        }

        Map<Object, Object> resultMap = new LinkedHashMap<>();
        resultMap.put("chargingpointActive", jsonListOuter);
        System.out.println(resultMap);

        Gson gson = new GsonBuilder().create();
        return gson.toJson(resultMap);
    }

    public String provideJsonCumulativePowerKWhDay(QueryResult queryResult) {
        List<List<Object>> rawResult = queryResult.getResults().get(0).getSeries().get(0).getValues();
        Map<Object, Object> resultMap = new LinkedHashMap<>();

        int dayCount = 0;
        Double sum = 0.;
        String date = "";
        for(List<Object> list : rawResult) {
            // first hour of day
            if(dayCount == 0) {
                date = list.get(0).toString();
                sum = 0.;
            }
            dayCount +=1;

            if( list.get(1) != null) {
                sum += (Double) list.get(1);
            }
            // last hour of day
            if(dayCount == 24) {
                if(sum == 0) {
                    resultMap.put(date, "null");
                } else {
                    resultMap.put(date,  UtilFunctions.round((sum / 1000), 3));
                }
                dayCount = 0;
            }
        }
        Gson gson = new GsonBuilder().create();
        return gson.toJson(resultMap);
    }

    public List<Integer> provideChargingPointsForActive(QueryResult queryResult) {
        List<List<Object>> rawResult = queryResult.getResults().get(0).getSeries().get(0).getValues();
        List<Integer> jsonList = new ArrayList<>();
        for(List<Object> list : rawResult) {
            jsonList.add( Integer.parseInt(list.get(1).toString()));
        }
        return jsonList;
    }

    public  Boolean hasActivePointAtDate(QueryResult queryResult, String date) {
        List<List<Object>> rawResult = queryResult.getResults().get(0).getSeries().get(0).getValues();
        boolean first = true;

        List<Boolean> jsonListInner = new ArrayList<>();
        for (List<Object> list : rawResult) {

            if (jsonListInner.isEmpty()) {
                jsonListInner.add((Boolean) list.get(2));
            }
            if (list.get(0).toString().contains(date)) {
                jsonListInner.add((Boolean) list.get(2));
            } else {
                jsonListInner.add((Boolean) list.get(2));
                break;
            }
        }
        return jsonListInner.contains(true);
    }

    public String provideJsonCumulativePowerKWhDay_2(QueryResult queryResult) {
        // First implementation returns also null values
        List<List<Object>> rawResult = queryResult.getResults().get(0).getSeries().get(0).getValues();
        Map<Object, Object> resultMap = new LinkedHashMap<>();
        for(List<Object> list : rawResult) {

            Object value = "null";
            if( list.get(1) != null) {
                value = ((Double) list.get(1) * 24) / 1000;
            }

            resultMap.put(list.get(0), round((Double)value, 3));
        }
        Gson gson = new GsonBuilder().create();
        return gson.toJson(resultMap);
    }

    public String provideJsonCumulativePowerKWhWeek(QueryResult queryResult) {
        List<List<Object>> rawResult = queryResult.getResults().get(0).getSeries().get(0).getValues();
        Map<Object, Object> resultMap = new LinkedHashMap<>();

        Double sum = 0.;
        for(List<Object> list : rawResult) {
            if( list.get(1) != null) {
                sum += (Double) list.get(1);
            }
        }

        resultMap.put("sum", round((sum / 1000), 3));
        Gson gson = new GsonBuilder().create();
        return gson.toJson(resultMap);
    }

    public double roundDouble(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }

    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }

    public String parseJsonPowerPerWeek(QueryResult result) {
        String res = "";

        List<List<Object>> rawResult = result.getResults().get(0).getSeries().get(0).getValues();
        Map<Object, Object> resultMap = new LinkedHashMap<>();
        for(List<Object> list : rawResult) {
            if (list.get(1) != null) {
                resultMap.put(list.get(0), UtilFunctions.round((Double) list.get(1), 3));
            } else {
                resultMap.put(list.get(0), 0.000);
            }
        }
        Gson gson = new GsonBuilder().create();
        res = gson.toJson(resultMap);
        //System.out.println(res);
        return res;
    }
}
