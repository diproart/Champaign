// @flow
export type Call = {
  id: number;
  status: string;
}

export type CallTool = {
  currentCall?: Call;
};

export type CallToolAction =
  | { type: 'set_current_call', payload: Call }
  | { type: 'update_current_call_status',  payload: string };

const initialState: CallTool = {};

export default (state: CallTool = initialState, action: CallToolAction): CallTool => {
  switch (action.type) {
    case 'set_current_call':
      return { ...state, currentCall: action.payload };
    case 'update_current_call_status':
      return { ...state, currentCall: { ...state.currentCall, status: action.payload } };
    default:
      return state;
  }
};
