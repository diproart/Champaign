// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import $ from 'jquery';
import { camelizeKeys } from './util';

export type OperationResponse = {
  success: boolean;
  errors: {[id:string]: string[]};
}

const parseSuccessfulResponse = (payload, textStatus, response): OperationResponse => {
  return { success: true, errors: {}, ...payload };
};

const parseErrorResponse = (response, textStatus, other): OperationResponse => {
  switch (response.status) {
    case 422:
      return { success: false, errors: camelizeKeys(response.responseJSON.errors) };
    default:
      return {
        success: false,
        errors: {
          base: [<FormattedMessage id="call_tool.errors.unknown" defaultMessage={`Unknown error, code ${response.code}`} />]
        }
      };
  }
};

const createCall = function(params: {pageId: string|number, memberPhoneNumber?: string, targetIndex: number}): Promise<OperationResponse> {
  const payload = {
    call: {
      member_phone_number: params.memberPhoneNumber,
      target_index: params.targetIndex
    }
  };

  return $.post(`/api/pages/${params.pageId}/calls`, payload).then(parseSuccessfulResponse, parseErrorResponse);
};

const getCall = (pageId:number, id:number): Promise<OperationResponse> => {
  return $.get(`/api/pages/${pageId}/calls/${id}`).then(parseSuccessfulResponse, parseErrorResponse);
};

const ChampaignAPI = {
  calls: {
    create: createCall,
    get:    getCall
  }
};

export default ChampaignAPI;
