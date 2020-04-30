import React, { Component }  from 'react';

import ChargeControlButtons from "./ChargeControlButtons";
import CustomerButtons from "./CustomerButtons";

class DrawerButtons extends Component {

  constructor(props) {
    super(props);
  }

  createChargeControlButtons() {
    return(
      <ChargeControlButtons updateViewFunc={this.props.updateViewFunc}/>
    );
  }

  createFlottenManagerButtons() {
    return(
      <CustomerButtons updateViewFunc={this.props.updateViewFunc}/>
    );
  }

  render() {
    return (
      this.props.loggedInUser === 1 ? this.createChargeControlButtons() : this.createFlottenManagerButtons()
    )
  }
}

export default DrawerButtons;