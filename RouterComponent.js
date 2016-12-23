import React, { PureComponent, PropTypes } from 'react';
import { BackAndroid, Platform, NavigationExperimental } from 'react-native';
import { connect } from 'react-redux';
import { validAction, validRoute } from './utils/validators';
import { actionCreators } from './redux';

class Router extends PureComponent {

  componentWillMount() {
    const { routes, push, state } = this.props;

    if (!routes.indexRoute) {
      throw new Error('Index route not found in routes config.');
    }

    if (!validRoute(routes.indexRoute)) {
      throw new Error('Invalid route configuration');
    }

    if (state.routes.length === 0) {
      push({ key: routes.indexRoute.key });
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.handleBackAction);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.handleBackAction);
    }
  }

  handleNavigate = (key, params) => {
    const action = { key, params };
    return validAction(action) ? this.props.push(action) : false;
  }

  handleBackAction = () => {
    return this.props.pop();
  }

  getRoute(key) {
    const { routes: { routes, indexRoute } } = this.props;

    if (indexRoute.key === key) {
      return indexRoute;
    }

    let route = routes.find((item) => item.key === key) || routes.find((item) => item.key === '*');
    if (!route) {
      throw new Error('Route not found');
    }

    return route;
  }

  getRouteParams(route) {
    const { defaultParams = {} } = this.getRoute(route.key);
    const { params = {} } = route;
    return { ...defaultParams, ...params };
  }

  renderHeader = (sceneProps) => {
    const { scene: { route } } = sceneProps;
    const { header: HeaderComponent } = this.props;
    return HeaderComponent ? <HeaderComponent
      sceneProps={sceneProps}
      params={this.getRouteParams(route)}
      onNavigateBack={this.handleBackAction}
    /> : null;
  }

  renderScene = ({ scene: { route } }) => {
    const { key } = route;
    const { component: RouteComponent }  = this.getRoute(key);
    return <RouteComponent
      key={key}
      params={this.getRouteParams(route)}
    />;
  }

  render() {
    const { state } = this.props;

    return state.index !== null ? <NavigationExperimental.CardStack
      navigationState={state}
      onNavigateBack={this.handleNavigate}
      renderHeader={this.renderHeader}
      renderScene={this.renderScene}
    /> : null;
  }
}

const RoutePropTypes = PropTypes.shape({
  key: PropTypes.string.isRequired,
  params: PropTypes.object,
  component: PropTypes.any.isRequired,
});

Router.propTypes = {
  state: PropTypes.object.isRequired,
  header: PropTypes.oneOfType([PropTypes.func, PropTypes.element,]),
  routes: PropTypes.shape({
    indexRoute: RoutePropTypes.isRequired,
    routes: PropTypes.arrayOf(RoutePropTypes).isRequired,
  }).isRequired,
};

const mapStateToProps = ({ router: state }) => ({ state });
export default connect(mapStateToProps, actionCreators)(Router);
