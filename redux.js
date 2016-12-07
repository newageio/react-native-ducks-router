// @flow
import { NavigationExperimental } from 'react-native';

import shallowCompare from './utils/shallowCompare';

const { StateUtils } = NavigationExperimental;

const KEY = 'router';
const ROUTER_PUSH = `${KEY}/push`;
const ROUTER_POP = `${KEY}/pop`;
const ROUTER_RESET = `${KEY}/reset`;

type Route = {
  key: string,
  params?: Object,
};

type State = {
  index: ?number,
  routes: Route[],
};

type Handler<T> = {
  [key: string]: (state: T, action: Action<*>) => T,
};

type Action<T> = {
  type: string,
  payload: T,
};

type ResetPayload = {
  routes: Route | Route[],
  index?: number,
};

function push(payload: Route) {
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

function reset(payload: ResetPayload) {
  return {
    type: ROUTER_RESET,
    payload,
  };
}

const initialState: State = {
  index: null,
  routes: [],
};

const actionHandlers: Handler<State> = {
  [ROUTER_PUSH]: (state, action: Action<Route>): State => {
    const newRoute = action.payload;
    if (state.routes.length === 0 ) {
      return StateUtils.push(state, newRoute);
    }

    const currentRoute = state.routes[state.index];
    const sameRoute = currentRoute.key === (newRoute && newRoute.key);
    const payloadDiffers = currentRoute.params
      && newRoute.params && !shallowCompare(currentRoute.params, newRoute.params);

    if (sameRoute && !payloadDiffers) {
      return state;
    }

    return sameRoute && payloadDiffers
      ? StateUtils.replaceAt(state, newRoute.key, newRoute)
      : StateUtils.push(state, newRoute);
  },

  [ROUTER_POP]: (state, action: Action<void>): State => state.index > 0 ? StateUtils.pop(state) : state,
  [ROUTER_RESET]: (state, action: Action<ResetPayload>): State => {
    const { routes, index } = action.payload;
    const newRoutes = Array.isArray(routes) ? routes : [routes];
    return StateUtils.reset(state, newRoutes, index);
  },
};

const actionTypes = {
  ROUTER_PUSH,
  ROUTER_POP,
  ROUTER_RESET,
};

const actionCreators = {
  push,
  pop,
  reset,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default (state: State = initialState, action: Action<*>): State => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};
