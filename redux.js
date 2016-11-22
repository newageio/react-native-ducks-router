import { NavigationExperimental } from 'react-native';
import shallowCompare from './utils/shallowCompare';

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
  params: {},
  routes: [],
};

const actionHandlers = {
  [ROUTER_PUSH]: (state, action) => {
    if (state.routes.length === 0) {
      const newState = StateUtils.push(state, action.payload);
      newState.params = action.payload.params ? action.payload.params : {};
      return newState;
    }

    const sameRoute = state.routes[state.index].key === (action.payload && action.payload.key);
    const payloadDiffers = action.payload.params && !shallowCompare(state.params, action.payload.params);

    if (sameRoute && !payloadDiffers) {
      return state;
    }

    const newState = sameRoute && payloadDiffers
      ? StateUtils.replaceAt(state, action.payload.key, action.payload)
      : StateUtils.push(state, action.payload);

    newState.params = action.payload.params ? action.payload.params : {};
    return newState
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
