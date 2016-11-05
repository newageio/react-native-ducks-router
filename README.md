# React native ducks router

#### Install

```bash
npm i --save react-native-ducks-router
```

#### Usage

```js
import Router, { routerReducer } from 'react-native-ducks-router';

...

const AppContainer = ({store, routes}) => <Provider store={store}>
  <Router routes={routes}/>
</Provider>;

const Home = ({ params, router }) => <View>
  <Text>Hello</Text>
</View>;

const SignIn = ({ params, router }) => <View>
  <Text>Sign In</Text>
</View>;

const About = ({ params, router }) => <View>
  <Text>About {params.message}</Text>
</View>;

const store = createStore();
const routes = {
  indexRoute: {
    key: 'home', // required
    params: {}, // optional
    component: Home,
  },
  routes: [
    {
      key: 'about',
      params: { message: 'Us' },
      component: About,
    },
    {
      key: 'sign-in',
      component: SignIn,
    },
  ],
};

const App = () => <AppContainer />;
...

AppRegistry.registerComponent('MyAwesomeApp', App)
```
