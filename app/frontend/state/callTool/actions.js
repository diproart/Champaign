// @flow
import type { CallToolAction, Call } from './reducer.js';

export function setCurrentCall(payload: Call): CallToolAction {
  return { type: 'set_current_call', payload };
}

export function updateCurrentCallStatus(payload: string): CallToolAction {
  return { type: 'update_current_call_status', payload };
}
