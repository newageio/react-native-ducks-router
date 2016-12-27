import { expect } from 'chai';
import './bootstrap';
import {
  actionCreators,
  actionTypes,
} from '../src/redux';

describe('actions creators', () => {
  it('push', () => {
    const route = { key: 'home', params: { name: 'Alex' } };
    const action = actionCreators.push(route);
    expect(action).to.eql({
      type: actionTypes.ROUTER_PUSH,
      payload: route,
    });
  });

  it('pop', () => {
    const action = actionCreators.pop();
    expect(action).to.eql({
      type: actionTypes.ROUTER_POP,
    });
  });

  it('reset', () => {
    const resetPayload = {
      routes: [
        { key: 'home' },
        { key: 'profile' },
      ],
      index: 1,
    };
    const action = actionCreators.reset(resetPayload);
    expect(action).to.eql({
      type: actionTypes.ROUTER_RESET,
      payload: resetPayload,
    });
  });
});

