import { ResponsiveBar } from '@nivo/bar'
import React, {Component} from "react";

class LoadingPointsWeeklyChart extends Component {

  constructor (props) {
    super(props);

    this.handleChartClick = this.handleChartClick.bind(this);
  }

  handleChartClick(e) {
    if(e.value > 0) {
      this.props.switchViewCallback(e.index);
    }
  }

  render() {
    return(
      <ResponsiveBar onClick={this.handleChartClick}
        data=
          {
            [
              {
                "day": this.props.dates[0],
                "Ladepunkte": this.props.points[0]
              },
              {
                "day": this.props.dates[1],
                "Ladepunkte": this.props.points[1]
              },
              {
                "day": this.props.dates[2],
                "Ladepunkte": this.props.points[2]
              },
              {
                "day": this.props.dates[3],
                "Ladepunkte": this.props.points[3]
              },
              {
                "day": this.props.dates[4],
                "Ladepunkte": this.props.points[4]
              },
              {
                "day": this.props.dates[5],
                "Ladepunkte": this.props.points[5]
              },
              {
                "day": this.props.dates[6],
                "Ladepunkte": this.props.points[6]
              }
            ]
          }
        keys={['Ladepunkte']}
        colors={{ scheme: 'accent' }}
        indexBy="day"
        enableGridX = {true}
        enableGridY = {true}
        margin={{top: 50, right: 130, bottom: 50, left: 60}}
        padding={0.3}
        groupMode="grouped"
        colors={{scheme: 'accent'}}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: '#38bcb2',
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: '#eed312',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        fill={[
          {
            match: {
              id: 'fries'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'sandwich'
            },
            id: 'lines'
          }
        ]}
        borderColor={{from: 'color', modifiers: [['darker', 1.6]]}}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Tag der Woche',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Summierte Anzahl der Ladepunkte',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        labelSkipWidth={400}
        labelSkipHeight={400}
        labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    );
  }
}

export default LoadingPointsWeeklyChart;