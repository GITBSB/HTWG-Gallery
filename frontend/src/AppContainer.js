import React, { Component }  from 'react';

import DashboardDrawer from './components/statics/drawer/DashboardDrawer'

class AppContainer extends Component {

  DEFAULT_VIEW = 1;

  constructor(props) {
    super(props);

    this.state = {
      viewToShow: this.DEFAULT_VIEW,
    };

    this.changeView = this.changeView.bind(this);
  }

  changeView(numb) {
    this.setState({viewToShow: numb});
  }

  render() {
    return(
      <div>
        <DashboardDrawer />
      </div>
    )
  }
}

export default AppContainer;