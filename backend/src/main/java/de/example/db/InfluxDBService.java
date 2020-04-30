package de.example.db;

import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class InfluxDBService {
    private final Logger log = LoggerFactory.getLogger(getClass());


    @Value("${influxdb.url}")
    private String url;

    @Value("${influxdb.user}")
    private String user;

    @Value("${influxdb.password}")
    private String password;

    @Value("${influxdb.dbname}")
    private String dbname;

    @Value("${influxdb.enabled}")
    private boolean enabled;


    public QueryResult query(String query){
        return query(dbname, query);
    }

    public QueryResult query(String dbname, String query){
        return query(dbname, new Query(query));
    }

    public QueryResult query(Query query){
       return query(dbname, query);
    }

    public QueryResult query(String dbname, Query query){
        try (InfluxDB influxDB = InfluxDBFactory.connect(url,  user, password)) {
            // Read or Write, do any thing you want
            influxDB.setDatabase(dbname);
            return influxDB.query(query);
        }
    }
}
