import React, { Component, PropTypes } from 'react';
import { BackAndroid, NavigationExperimental, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { validAction, validRoute } from './utils/validators';
import { actionCreators } from './redux';

class Router extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleBackAction = this.handleBackAction.bind(this);

    this.renderScene = this.renderScene.bind(this);
  }

  componentWillMount() {
    const { routes, push } = this.props;

    if (!routes.indexRoute) {
      throw new Error('Index route not found in routes config.');
    }

    if (!validRoute(routes.indexRoute)) {
      throw new Error('Invalid route configuration');
    }

    push(routes.indexRoute);
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackAction)
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackAction)
  }

  handleNavigate(key, params) {
    const action = { key, params };

    return validAction(action) ? this.props.push(action) : false;
  }

  handleBackAction() {
    return this.props.pop();
  }

  getRoute(key) {
    const { routes: { routes, indexRoute } } = this.props;

    if (indexRoute.key === key) {
      return indexRoute;
    }

    let route = routes.find((item) => item.key === key);
    if (!route) {
      route = routes.find((item) => '*')
    }

    return route;
  }

  renderScene({ scene }) {
    const { key, params } = scene.route;
    const route = this.getRoute(key);

    if (!route) {
      throw new Error('Route not found');
    }
    const { params: defaultParams, component: RouteComponent } = route;
    const router = {
      push: this.handleNavigate,
    };

    return <RouteComponent
      router={router}
      params={{ ...defaultParams, ...params }}
    />;
  }

  render() {
    const { state } = this.props;

    return state.index !== null ? <NavigationExperimental.CardStack
      navigationState={state}
      onNavigate={this.handleNavigate}
      renderScene={this.renderScene}
    /> : null;
  }
}

const RoutePropType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  params: PropTypes.object,
  component: PropTypes.any.isRequired,
});

Router.propTypes = {
  state: PropTypes.object.isRequired,
  routes: PropTypes.shape({
    indexRoute: RoutePropType.isRequired,
    routes: PropTypes.arrayOf(RoutePropType).isRequired,
  }).isRequired,
};

const mapStateToProps = ({ router: state }) => ({ state });
export default connect(mapStateToProps, actionCreators)(Router);
