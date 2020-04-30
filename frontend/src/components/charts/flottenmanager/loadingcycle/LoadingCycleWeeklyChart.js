import React from "react";
import DashboardSnackBar from "../../../commons/rest/DashboardSnackBar";
import { ResponsiveLine } from '@nivo/line/dist/nivo-line.esm'

class LoadingCycleWeeklyChart extends React.Component {

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
      <div style={{height: '400px', width: "100%"}}>
        <ResponsiveLine
          data={this.props.data}
          colors={{ scheme: 'accent' }}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Zeit',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Kilowatt',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          colors={{ scheme: 'accent' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
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
            }
          ]}
        />
      </div>
    )
  }
}
export default LoadingCycleWeeklyChart