// @flow
//
// Bootstrap takes care of initializing a global store, but does not import any
// components or app modules

import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import deLocaleData from 'react-intl/locale-data/de';
import frLocaleData from 'react-intl/locale-data/fr';
import esLocaleData from 'react-intl/locale-data/es';
import configureStore from './state';

import type { Store } from 'redux';
import type { AppState } from './state/reducers';

const initialState = {};
export const store: Store<AppState, *> = configureStore(initialState);

window.globalStore = store;

addLocaleData([
  ...enLocaleData,
  ...deLocaleData,
  ...frLocaleData,
  ...esLocaleData,
]);
