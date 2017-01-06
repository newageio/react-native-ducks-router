import React, { PureComponent, PropTypes } from 'react';
import { BackAndroid, Platform, NavigationExperimental } from 'react-native';
import { connect } from 'react-redux';
import { validAction, validRoute } from './utils/validators';
import { actionCreators } from './redux';

class Router extends PureComponent {

  handlingBack = false;

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
    BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackAction);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackAction);
  }

  handleHardwareBack() {
    if (Platform.OS === 'android' && !this.handlingBack) {
      this.handlingBack = true;
    }
  }

  unhandleHardwareBack() {
    if (Platform.OS === 'android' && this.handlingBack) {
      this.handlingBack = false;
    }
  }

  handleNavigate = (key, params) => {
    const action = { key, params };
    return validAction(action) ? this.props.push(action) : false;
  };

  handleBackAction = () => {
    this.props.pop();
  };

  handleHardwareBackAction = () => {
    if (this.handlingBack) {
      this.handleBackAction()
    }
    return true;
  };

  getRoute(key) {
    const { routes: { routes, indexRoute } } = this.props;

    if (indexRoute.key === key) {
      return indexRoute;
    }

    const route = routes.find(item => item.key === key) || routes.find(item => item.key === '*');
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
        onNavigateBack={this.handleBackAction}
        params={this.getRouteParams(route)}
        sceneProps={sceneProps}
      /> : null;
  };

  renderScene = ({ scene: { route } }) => {
    const { key } = route;
    const { component: RouteComponent } = this.getRoute(key);
    const params = this.getRouteParams(route);
    this.unhandleHardwareBack();
    if (typeof params.back === 'undefined' || params.back) {
      this.handleHardwareBack();
    }
    return (
      <RouteComponent
        key={key}
        params={params}
      />
    );
  };

  render() {
    const { state, cardStackProps } = this.props;
    return state.index !== null ? <NavigationExperimental.CardStack
        {...cardStackProps}
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
  push: PropTypes.func.isRequired,
  pop: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  header: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  routes: PropTypes.shape({
    indexRoute: RoutePropTypes.isRequired,
    routes: PropTypes.arrayOf(RoutePropTypes).isRequired,
  }).isRequired,
  cardStackProps: PropTypes.object,
};

Router.defaultProps = {
  cardStackProps: {},
  header: null,
};

const mapStateToProps = ({ router: state }) => ({ state });
export default connect(mapStateToProps, actionCreators)(Router);
