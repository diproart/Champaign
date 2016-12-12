// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { FormattedMessage } from 'react-intl';

import Checkbox from '../Checkbox/Checkbox';
import DonateButton from '../DonateButton';
import PaymentMethodWrapper from './PaymentMethodWrapper';
import PaymentMethodItem from './PaymentMethod';
import { setRecurring, showExpressDonations } from '../../state/fundraiser/actions';

import type { Dispatch } from 'redux';
import type {
  AppState,
  PaymentMethod,
  FundraiserState
} from '../../state/index';

import './ExpressDonation.scss';

type OwnProps = {
  fundraiser: FundraiserState;
  paymentMethods: PaymentMethod[];
  hideExpressDonations: () => void;
  setRecurring: (value: boolean) => void;
};

type OwnState = {
  currentPaymentMethod: ?PaymentMethod;
  submitting: boolean;
};

export class ExpressDonation extends Component {
  props: OwnProps;
  state: OwnState;

  constructor(props: OwnProps) {
    super(props);

    this.state = {
      currentPaymentMethod: props.paymentMethods ? props.paymentMethods[0] : null,
      submitting: false,
    };
  }

  // Payment methods don't really change after we've loaded them from
  // Champaign so in theory we don't need this, however, should the `parse_champaign_data`
  // action get dispatched after we've rendered, this would update us.
  componentWillReceiveProps(newProps: OwnProps) {
    this.setState({ currentPaymentMethod: newProps.paymentMethods[0] });
  }

  oneClickData() {
    if (!this.state.currentPaymentMethod) return null;

    return {
      payment: {
        currency: this.props.fundraiser.currency,
        amount: this.props.fundraiser.donationAmount,
        recurring: this.props.fundraiser.recurring,
        payment_method_id: this.state.currentPaymentMethod.id,
      },
      user: {
        form_id: this.props.fundraiser.formId,
        // formValues will have the prefillValues
        ...this.props.fundraiser.formValues,
        // form will have the user's submitted values
        ...this.props.fundraiser.form
      }
    };
  }

  async onSuccess(data: any) {
    console.log('one click success:', data, this.oneClickData());
    return data;
  }

  async onFailure(reason: any) {
    console.log('one click failure:', reason, this.oneClickData());
    return reason;
  }

  submit() {
    const { fundraiser: { pageId } }  = this.props;
    const data = this.oneClickData();
    if (data) {
      this.setState({ submitting: true });
      $.post(`/api/payment/braintree/pages/${pageId}/one_click`, data)
        .then(
          this.onSuccess.bind(this),
          this.onFailure.bind(this)
        );
    }
  }

  selectPaymentMethod(paymentMethod: PaymentMethod) {
    this.setState({ currentPaymentMethod: paymentMethod });
  }

  renderPaymentMethodRadio(paymentMethod: PaymentMethod) {
    return (
      <div className="ExpressDonation__payment-method-radio">
        <input
          type="radio"
          checked={this.state.currentPaymentMethod === paymentMethod}
          onChange={() => this.selectPaymentMethod(paymentMethod)}
        />
        <PaymentMethodItem paymentMethod={paymentMethod} />
      </div>
    );
  }

  renderSingle() {
    const item = this.state.currentPaymentMethod;
    if (!item) return null;
    return (
      <PaymentMethodWrapper>
        <div className="ExpressDonation__single-item">
          <PaymentMethodItem paymentMethod={item} />
        </div>
      </PaymentMethodWrapper>
    );
  }

  renderChoices() {
    return (
      <PaymentMethodWrapper>
        <span className="ExpressDonation__prompt">
          <FormattedMessage id="fundraiser.oneclick.select_payment" defaultMessage="Select a saved payment method" />
        </span>

        { this.props.paymentMethods.map(paymentMethod =>
            <PaymentMethodItem
              key={paymentMethod.id}
              paymentMethod={paymentMethod}
              checked={this.state.currentPaymentMethod === paymentMethod}
              onChange={() => this.selectPaymentMethod(paymentMethod)}
            />
          )
        }
      </PaymentMethodWrapper>
    );
  }

  render() {
    if (!this.props.paymentMethods.length) return null;

    return (
      <div className="ExpressDonation">
        <div className="ExpressDonation__payment-methods">
          { this.props.paymentMethods.length === 1 ? this.renderSingle() : this.renderChoices() }
          <a className="ExpressDonation__toggle" onClick={() => this.props.hideExpressDonations()}>
            <FormattedMessage id="fundraiser.oneclick.new_payment_method" defaultMessage="Add payment method" />
          </a>
        </div>

        <Checkbox
          className="Payment__config"
          disabled={this.props.fundraiser.recurringDefault === 'one_off'}
          defaultChecked={this.props.fundraiser.recurring}
          onChange={(e) => this.props.setRecurring(e.target.checked)}>
          <FormattedMessage id="fundraiser.make_recurring" defaultMessage="Make my donation monthly" />
        </Checkbox>

        <DonateButton
          currency={this.props.fundraiser.currency}
          amount={this.props.fundraiser.donationAmount || 0}
          disabled={!this.state.currentPaymentMethod || this.state.submitting}
          onClick={() => this.submit()}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  paymentMethods: state.paymentMethods,
  fundraiser: state.fundraiser,
});

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  hideExpressDonations: () => dispatch(showExpressDonations(false)),
  setRecurring: (value: boolean) => dispatch(setRecurring(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpressDonation);