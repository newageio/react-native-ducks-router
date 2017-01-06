const validAction = action => !!action && action.key;
const validRoute = route => !!route && typeof route === 'object' && route.key && route.component;

export {
  validAction,
  validRoute,
};
