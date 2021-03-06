// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PaymentMethodWrapper from '../ExpressDonation/PaymentMethodWrapper';

export default class PaymentTypeSelection extends Component {
  props: {
    disabled?: boolean;
    currentPaymentType?: string;
    onChange: (paymentType: string) => void;
    showDirectDebit: ?boolean;
  };

  render() {
    const { disabled, currentPaymentType, onChange } = this.props;
    const methods = ['card', 'paypal'];
    if (this.props.showDirectDebit) methods.push('gocardless');

    return (
      <div className='PaymentTypeSelection__payment-methods'>
        <PaymentMethodWrapper>
          <span className="PaymentTypeSelection__prompt">
            <FormattedMessage id="fundraiser.payment_type_prompt" defaultMessage="Payment Method" />
          </span>

          {methods.map((method, i) => {
            return (
              <div className="PaymentMethod" key={i}>
                <label>
                    <input
                      disabled={disabled}
                      type="radio"
                      checked={currentPaymentType === method}
                      onChange={(e) => onChange(method)}
                    />
                  <FormattedMessage id={`fundraiser.payment_methods.${method}`} defaultMessage="Unknown payment method" />
                </label>
              </div>
            );
          })}
        </PaymentMethodWrapper>
      </div>
    );
  }
}
