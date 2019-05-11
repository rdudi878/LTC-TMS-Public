/*
  App.js

  Main component for the application - may be thought of as the root node in 
  the React component tree.
*/

import React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
//import SplashScreen from 'react-native-splash-screen';
import AppContainer from './config/navigationConfig';
import styles from './styles/styles';

class App extends React.Component {
  // render the AppContainer defined in '$PROJECT_ROOT/config/navigationConfig.js'

  render() {
    return <AppContainer />
  }
}

export default App;