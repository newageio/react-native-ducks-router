import { expect } from 'chai';
import './bootstrap';
import reducer, {
  actionCreators,
  actionTypes,
  initialState,
} from '../src/redux';

const route = { key: 'home', params: { name: 'Alex' } };
const route2 = { key: 'profile', params: { id: 2 } };
const route3 = { key: 'settings', params: { id: 3 } };
const route4 = { key: 'list', params: { id: 4 } };

describe('actions creators', () => {
  it('push', () => {
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

describe('reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, {});
    expect(state).to.be.equal(initialState);
  });

  describe('should handle push', () => {
    it('should return new state', () => {
      const newState = reducer(initialState, actionCreators.push(route));
      expect(initialState).to.not.equal(newState);
      expect(newState).to.be.eql({
        index: 0,
        routes: [route],
      });
    });

    it('state should not change on same route push', () => {
      const action = actionCreators.push(route);
      const state = reducer(initialState, action);
      const newState = reducer(state, action);
      expect(newState).to.be.equal(state);
      expect(newState).to.be.eql({
        index: 0,
        routes: [route],
      });
    });

    it('state should change on same route push with differ params', () => {
      const state = reducer(initialState, actionCreators.push(route));
      const routeWithOtherParams = {
        ...route,
        params: { name: 'Max' },
      };
      const newState = reducer(state, actionCreators.push(routeWithOtherParams));
      expect(newState).to.not.equal(state);
      expect(newState).to.be.eql({
        index: 0,
        routes: [routeWithOtherParams],
      });
    });
  });

  it('should handle pop', () => {
    const state = {
      index: 1,
      routes: [route, route2],
    };
    const newState = reducer(state, actionCreators.pop());
    expect(newState).to.not.equal(state);
    expect(newState).to.be.eql({
      index: 0,
      routes: [route],
    });
  });

  describe('should handle reset', () => {
    it('should handle reset with routes as array', () => {
      const state = {
        index: 1,
        routes: [route, route2],
      };
      const newState = reducer(state, actionCreators.reset({ index: 0, routes: [route3, route4] }));
      expect(newState).to.not.equal(state);
      expect(newState).to.be.eql({
        index: 0,
        routes: [route3, route4],
      });
    });

    it('should handle reset with route', () => {
      const state = {
        index: 1,
        routes: [route, route2],
      };
      const newState = reducer(state, actionCreators.reset({ index: 0, routes: route3 }));
      expect(newState).to.not.equal(state);
      expect(newState).to.be.eql({
        index: 0,
        routes: [route3],
      });
    });
  });
});
