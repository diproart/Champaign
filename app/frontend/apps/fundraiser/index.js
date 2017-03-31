// @flow
import React from 'react';
import { render } from 'react-dom';

import configureStore from '../../state';
import ComponentWrapper from '../../ComponentWrapper';
import FundraiserView from '../../containers/FundraiserView/FundraiserView';

import type { Store } from 'redux';
import type { AppState } from '../../state/reducers';

import '../../components.css';

const store: Store<AppState, *> = configureStore({});

window.mountFundraiser = (root: string, initialState?: any = {})  => {
  store.dispatch({ type: 'initialize_page', payload: window.champaign.page });
  store.dispatch({ type: 'parse_champaign_data', payload: initialState });

  render(
    <ComponentWrapper store={store} locale={initialState['locale']}>
      <FundraiserView />
    </ComponentWrapper>,
    document.getElementById(root)
  );

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./containers/FundraiserView/FundraiserView', () => {
      const UpdatedFundraiserView = require('../../containers/FundraiserView/FundraiserView').default;
      render(
        <ComponentWrapper store={store} locale={initialState['locale']}>
          <UpdatedFundraiserView />
        </ComponentWrapper>,
        document.getElementById(root)
      );
    });
  }
};
