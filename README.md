# React-Native ducks router

#### Install

```bash
npm i --save react-native-ducks-router
```

#### Usage

```js
import Router, { routerReducer } from 'react-native-ducks-router';

...

const Home = ({ params, onPressButton }) => <View>
  <Text>Hello</Text>
  <Button onPress={onPressButton} title={`Sign In`}/>
</View>;

const SignIn = ({ params, onPressButton }) => <View>
  <Text>Sign In</Text>
  <Button onPress={onPressButton} title={`About Us`}/>
</View>;

const About = ({ params, onPressButton }) => <View>
  <Text>About {params.message}</Text>
  <Button onPress={onPressButton} title={`Go back`}/>
</View>;

...

import { connect } from 'react-redux';
import { actionCreators } from 'react-native-ducks-router';

const routes = {
  indexRoute: {
    key: 'home', // required
    component: connect(..., {
      onPressButton: actionCreators.push.bind(null, { key: 'sign-in' }),
    })(Home),
  },
  routes: [
    {
      key: 'about',
      component: connect(..., {
        onPressButton: actionCreators.pop,
      })(About),
    },
    {
      key: 'sign-in',
      component: connect(..., {
        onPressButton: actionCreators.push.bind(null, { key: 'about', params: { message: 'Hello' } }),
      })(SignIn),
    },
  ],
};

...

const reducers = {
  // Your reducers ...
  router: routerReducer,
};

...

const AppContainer = ({store, routes}) => <Provider store={store}>
  <Router routes={routes}/>
</Provider>;

const App = () => <AppContainer
  store={createStore(reducers, {})}
  routes={routes}
/>;

...

AppRegistry.registerComponent('MyAwesomeApp', App);
```
