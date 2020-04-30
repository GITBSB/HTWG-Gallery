import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

class CenterChartLoader extends React.Component {

  render() {
    return (
      <div style={{height: '300px'}}>
        <CircularProgress color="secondary" style={{
          marginLeft: '44%', marginTop: '12%'
        }}/>
      </div>
    )
  }
}

export default CenterChartLoader
