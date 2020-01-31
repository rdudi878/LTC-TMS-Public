
/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename: navigationConfig.js                                                                                   */
/* Last Edited By:                                                                              */
/* /*********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
//remove duplicate button component fron react native to use elements one
import { Button, ThemeProvider } from 'react-native-elements';
// group screen imports here
import SignInScreen from '../screens/SignInScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import PatientRecordsScreen from '../screens/PatientRecordsScreen';
import CenterInfoScreen from '../screens/CenterInfoScreen';
import TaskScreen from '../screens/TaskScreen';
import AiStatusReadScreen from '../screens/AiStatusReadScreen';
import DailyStatusAddScreen from '../screens/DailyStatusAddScreen';
import DailyStatusReadScreen from '../screens/DailyStatusReadScreen';
import VitalStatusReadScreen from '../screens/VitalStatusReadScreen';
import VitalStatusAddScreen from '../screens/VitalStatusAddScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import LogoutScreen from '../screens/LogoutScreen';

import I from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
//import FontAwesomeIcon from '@fortawesome/react-fontawesome';
//import { platform } from 'os';

// Routes for bottom navigation bar
//Updated 2-13-2019: commented out AppLeftStack routes that are not required -- fixed bottom navigation button illumination
//Center Schedule is required in this StackNavigator for button functionality to work
const AppLeftStack = createStackNavigator({
  Home: HomeScreen,
  //CenterInfo: CenterInfoScreen,
  // Portfolio: PortfolioScreen,
  //  Contact: CenterScheduleScreen,
}, {
    initialRouteKey: 'Home'
  });

// CenterInfoScreen.navigationOptions = {
//   tabBarLabel: "Center Info",
//   tabBarIcon: ({ tintColor }) => (
//     <IconFrontAwesome name="home"
//       style={{ color: tintColor }}
//     />
//   )
// }

// middle navigation container in tabular navigation bar
const AppMiddleStack = createStackNavigator({
  Record: PatientRecordsScreen,
  DailyStatusRead: DailyStatusReadScreen,
  DailyStatusAdd: DailyStatusAddScreen,
  AiStatusRead: AiStatusReadScreen,
  VitalStatusRead: VitalStatusReadScreen,
  VitalStatusAdd: VitalStatusAddScreen,
}, {
    initialRouteKey: 'Record'
  });

//Changed Task to Library
const AppTaskStack = createStackNavigator({
  Library: TaskScreen
}, {
    initialRouteKey: 'Library'
  });

const AppRightStack = createStackNavigator({
  Portfolio: LogoutScreen
}, {
    initialRouteKey: 'Portfolio'
  });

// update: Change schedule to Center information 
// Center info screen and navigation
const AppScheduleStack = createStackNavigator({
  CenterInfo: CenterInfoScreen,
  Feedback: FeedbackScreen,
}, {
    initialRouteKey: 'Center Info'
  });
//Feedback stack
const FeedbackStack = createStackNavigator({
  Feedback: FeedbackScreen
},
  {
    initialRouteKey: 'Feedback'
  });
//assign icon for each navigation tab
const getTabBarIcon = (navigation, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  let entypo = Entypo;
  if (routeName === 'Home') {
    iconName = `ios-home`;
  } else if (routeName === 'Record') {
    iconName = `ios-create`;
  } else if (routeName === 'Library') {
    iconName = `ios-book`;
  } else if (routeName === 'Center Info') {
    iconName = `ios-information-circle`;
  } else {
    iconName = `ios-person`;
  }

  return <IconComponent name={iconName} size={32} color={tintColor} />;
};



// Navigation bar will live at bottom of display
// Changed task to Library
const AppBottomTabNavigation = createBottomTabNavigator({
  Home: AppLeftStack,
  Record: AppMiddleStack,
  Library: AppTaskStack,
  //CenterInfo: AppScheduleStack,
  'Center Info': AppScheduleStack,
  Portfolio: AppRightStack
},

  { //call defaultNavigation for icon
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, tintColor),

    }),
    //change color of the icon when it is clicked
    tabBarOptions: {
      activeTintColor: '#3f9fff',
      inactiveTintColor: '#949494',
      labelStyle: {
        fontSize: 15,
        //fontFamily: ''
      },
      style: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0.5
      },
    },
  });






const AuthStack = createStackNavigator({
  SignIn: SignInScreen
});

// configuration for the default control for the app's navigation. While the main
// app is controlled by the AppBottomTabNavigation variable defined above,
// authentication checking is done with a Switch Navigator which does not allow a user
// to go back on their own. All redirects back to the signin page must be done
// programmatically, enhancing security.
const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppBottomTabNavigation,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));


export default AppContainer;