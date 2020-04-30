import { ResponsiveLine } from '@nivo/line'
import React, {Component} from "react";
import * as time from 'd3-time'
import DashboardSnackBar from '../../../commons/rest/DashboardSnackBar'

class LoadingPointsDailyChart extends Component {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      this.props.data == null ? <DashboardSnackBar /> : this.createChart()
    );
  }
  createChart() {
  return (
      <ResponsiveLine
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        data={[{ id: 'Ladepunkt', data: this.props.data }]}
        xScale={{ type: 'time', format: 'native' }}
        yScale={{ type: 'linear', stacked: true, min: 0, max: 1.1 }}
        axisTop={null}
        axisRight={null}
        curve={'stepBefore'}

        axisLeft={{
          tickValues: [0, 1],
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Inaktiv / Aktiv',
          legendOffset: -40,
          legendPosition: 'middle'
        }}

        axisBottom={{
          format: '%H:%M',
          tickValues: 'every 1 hours',
          legend: 'Zeit',
          legendPosition: 'middle',
          legendOffset: 36,
        }}
        colors={{ scheme: 'accent' }}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enableCrosshair={false}

        animate={true}
        motionStiffness={120}
        motionDamping={50}
        enableArea={true}
        isInteractive={false}
        enableSlices={false}
        useMesh={true}

        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1
                }
              }
            ]
          }]}

          />
    )
  }
}

export default LoadingPointsDailyChart;
