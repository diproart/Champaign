import React from 'react';
import { render } from 'react-dom';
import { camelizeKeys } from '../../util/util';
import CallToolView   from '../../containers/CallToolView/CallToolView';
import ComponentWrapper from '../../ComponentWrapper';

type callToolProps = {
  locale: string;
  title?: string;
  targets: any[];
  targetCountries: any[];
  countriesPhoneCodes: any[];
  pageId: string | number;
  targetByCountryEnabled: boolean;
};

window.mountCallTool = (root: string, props: callToolProps) => {
  props = camelizeKeys(props);

  render(
    <ComponentWrapper locale={props.locale}>
      <CallToolView {...props} />
    </ComponentWrapper>,
    document.getElementById(root)
  );
};
