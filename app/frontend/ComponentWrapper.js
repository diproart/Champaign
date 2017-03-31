/* @flow */
import React from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import loadTranslations from './util/TranslationsLoader';

type ComponentWrapperProps = {
  store?: Store,
  children?: any,
  locale: string,
};

function WrapInStore({ store, children }) {
  if (store) {
    return <Provider store={store}>{children}</Provider>;
  }
  return children;
}

export default function ComponentWrapper(props: ComponentWrapperProps) {
  return (
    <IntlProvider locale={this.props.locale} messages={loadTranslations(this.props.locale)}>
      <WrapInStore store={this.props.store}>
        {this.props.children}
      </WrapInStore>
    </IntlProvider>
  );
}
