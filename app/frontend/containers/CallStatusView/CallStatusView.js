// @flow
import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';


type OwnProps = {
}

class CallStatusView extends Component {
  props: OwnProps;

  render() {
    return (
      <div className="fixed-footer call-status-bar">
        <div className="center-content">
          <div className="call-status-bar__status">
            <span className="">Want to help us keep fighting for the bees?<br />Consider becoming a monthly sustainer</span>
          </div>
          <div className="call-status-bar__action">
            <a href="https://actions.sumofus.org/a/donate-to-save-the-bees?recurring=recurring_only" className="button">Become a sustainer</a>
          </div>
        </div>
      </div>
    );
  }
}

export default CallStatusView;
