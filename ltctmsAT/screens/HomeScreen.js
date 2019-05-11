/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: April 12, 2019                                                             */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename: HomeScreen.js                                                                                    */
/* Purpose: Displays Announcement list. Home screen for application.                          */
/**********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Button,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import {Text, TextInput} from 'native-base';
//import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/styles';
import AnnouncementList from '../components/AnnouncementList';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  render() {
    return (
      <View style ={styles.basicView}>
        <AnnouncementList /> 
      </View>
    );
  }

// Button for Logout will be moved to bottom navigation bar 
//<Button title="Logout" type='outline' onPress={this._signOutAsync} />

// handler to navigate to the Portfolio page
  _showPortfolio = () => {
    this.props.navigation.navigate('Portfolio');
  };

  // handler to navigate to the center schedule page
  _showCenterSchedule = () => {
    this.props.navigation.navigate('CenterSchedule');
  }

  // handler to clear the locally stored user info (logout) and navigate to the
  // sign in screen
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

export default HomeScreen;