// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChampaignAPI from '../../util/ChampaignAPI';
// import { FormattedMessage } from 'react-intl';

import type { AppState } from '../../state';
import type { Call } from '../../state/callTool/reducer';
import type { OperationResponse } from '../../util/ChampaignAPI';

type OwnProps = {
  currentCall?: Call;
}

class CallPoller {
  pageId: number;
  callId: number;
  _poll: boolean;
  getSuccessful: (?any) => void;
  getFailed: (?any) => void;


  constructor(pageId, callId:number) {
    this.pageId = pageId;
    this.callId = callId;
  }

  poll(onSuccess:(any)=>void, error:(any)=>void) {
    this._poll = true;
    ChampaignAPI.calls.get(this.pageId, this.callId).then(this.getSuccessful.bind(this), this.getFailed.bind(this));
  }

  getSuccessfull(result: OperationResponse) {

  }

  getFailed() {

  }
}

class CallStatusView extends Component {
  props: OwnProps;

  // nil => nil
  // nil => call_id
  // call_id => new_call_id
  // call_id => nil
  componentWillReceiveProps(nextProps: OwnProps) {
    const currentCallId = this.props.currentCall && this.props.currentCall.id;
    const nextCallId = nextProps.currentCall && nextProps.currentCall.id;

    if(currentCallId !== nextCallId) {
      // attempt to stop poller if any
      if(nextCallId) {
        //start poller
      }
    }
  }

  render() {
    const { currentCall } = this.props;

    return (
      <div className="fixed-footer call-status-bar">
        <div className="center-content">
          <div className="call-status-bar__status">
            <span className="">Want to help us keep fighting for the bees?<br />Consider becoming a monthly sustainer</span>
            { currentCall &&
              <span> { currentCall.status } </span>
            }
          </div>
          <div className="call-status-bar__action">
            <a href="https://actions.sumofus.org/a/donate-to-save-the-bees?recurring=recurring_only" className="button">Become a sustainer</a>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = (state: AppState) => ({
  currentCall: state.callTool.currentCall
});

export const mapDispatchToProps = (dispatch: Dispatch<*>) => ({});

CallStatusView = connect(mapStateToProps, mapDispatchToProps)(CallStatusView);

export default CallStatusView;
