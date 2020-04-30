# ChargeControl Dashboard

This is the chargecontrol dashboard application as part of HTWG-AUME 2019

# Getting started

To run this project you need a JDK 1.8 and Node.js v10.15.0 (or higher) with NPM installed.

For more information about Node.js and NPM see [nodejs.org](https://nodejs.org) and [docs.npmjs.com](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Backend

The backend application is a Spring Boot App. You can start the App with your IDE or from the commandline using gradle.
To start the backend use the following command:

```
./gradlew bootRun
```

The backend API is reachable under the port ``http://localhost:8080``.
The Backend also includes the Swagger UI API Browser for documentation of the API. You can find the UI under ``http://localhost:8080/swagger-ui.html``

## Frontend

For development you have to start the frontend separately using Node.js.


You run the frontend within the frontend directory using:

```
cd frontend
yarn install
```

yarn install in only needed only once to download and install required tools and dependencies


```
yarn start
```

This starts a web server at http://localhost:3000



See the [frontend docs](frontend/README.md) for more information.




# Production Build

To create a production build you can use the following command:

```
./gradlew jar
```

This will create a jar of the backend application with the frontend included.
The jar file is located under in ``backend/build/libs``

When you start the jar the frontend **and** the API is reachable under the port ``8080``

```
java -jar ./backend/build/libs/backend-0.0.1.jar
```

Launch the browser at http://localhost:8080 to see the app.

# Docs

About this project:

- [Vision](docs/Vision.md)
- [Architecture](docs/Architecture.md)

## Documentation Site

Generate Documentation-Site with command
```
./gradlew generateSiteHtml
```
A static index.html is generated in Directory: build/docs/site/

## Code Examples

- [frontend/src/components/Demo.js]() An Example React component that fetches data from REST API and shows it
- [backend/src/main/java/de/siobra/chargecontrol/api/demo/DemoApi.java]() Demo REST API implementation. The method lastRecord() queries InfluxDB and returns the results as JSON
- [backend/src/main/resources/application.yml]() Settings, see the InfluxDB connection details here

## InfluxDB Demo Data

The influxDB data on the server http://aume.siobra.de:8086/ contains real data from three charging stations
within the time range of 2019-07-01 to 2019-10-06. The data of each changing station is in a separate database. database names are: diakoniestation_kirchheim_teck, sozialstation_freiburg_quaekerstrasse and sozialstation_freiburg_immentalstrasse
( query database names: http://aume.siobra.de:8086/query?q=show%20databases )


## Developer docs

Some useful resources

- To learn React, check out the [React documentation](https://reactjs.org/).
- To learn about [Material Design Guidelines](https://material.io/)
- To learn the react [Material UI components](https://material-ui.com/)
- To learn [Spring Rest](https://spring.io/guides/gs/rest-service/)
- To learn about [InfluxDB](https://www.influxdata.com/products/influxdb-overview/)
- To learn using [InfluxDB with java](https://github.com/influxdata/influxdb-java)
