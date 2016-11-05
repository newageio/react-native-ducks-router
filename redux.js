import { NavigationExperimental } from 'react-native';

const { StateUtils } = NavigationExperimental;

const KEY = 'router';
const ROUTER_PUSH = `${KEY}/push`;
const ROUTER_POP = `${KEY}/pop`;

function push(payload) {
  return {
    type: ROUTER_PUSH,
    payload,
  };
}

function pop() {
  return {
    type: ROUTER_POP,
  };
}

const initialState = {
  index: null,
  key: null,
  params: {},
  routes: [],
};

const actionHandlers = {
  [ROUTER_PUSH]: (state, action) => {
    if (state.routes[state.index].key === (action.payload && action.payload.key)) {
      return state;
    }

    if ((state.routes.length && state.routes[state.routes.length - 1].key) === (action.payload && action.payload.key)) {
      return state;
    }

    const newState = StateUtils.push(state, action.payload);
    return state.index !== newState.index ? {
      ...newState,
      params: action.payload.params ? action.payload.params : {},
    } : state;
  },

  [ROUTER_POP]: (state, action) => state.index > 0 ? StateUtils.pop(state) : state,
};

const actionTypes = {
  ROUTER_PUSH,
  ROUTER_POP,
};

const actionCreators = {
  push,
  pop,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};
