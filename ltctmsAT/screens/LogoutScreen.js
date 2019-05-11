/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:                                                                                    */
/* Last Edited By:                                                                              */
/* /*********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import { Button, ThemeProvider } from 'react-native-elements';
import styles from '../styles/styles';

class LogoutScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userInfo: '',
    };

  }
//top bar title 
  static navigationOptions = {
    title: 'Logout',
  };
/*************************************************************************/
  /* */
  /* Function name: _fetchUserInfo */
  /* Description: Fetch the user info from database and pass it to userInfo */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  async _fetchUserInfo() {
    const userInfo = await AsyncStorage.getItem("userInfo");
    this.setState({
      userInfo: JSON.parse(userInfo)
    });

  }
/*************************************************************************/
  /* */
  /* Function name: componentWillMount */
  /* Description: call _fetchUserInfo function before render() */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  async componentWillMount() {
    await this._fetchUserInfo();
  }

  render() {
    const user = this.state.userInfo;
    return (

      <View style={styles.container}>
        <Text style={{ padding: 10, fontSize: 16, fontWeight: 'bold', color: 'black' }}>Logged In As {user.Name}</Text>
        <Button
          title="Log out"
          type="outline"
          onPress={() => Alert.alert(
            'Logout',
            'Are you sure?',
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
              { text: 'OK', onPress: () => this._signOutAsync() },
            ],
            { cancelable: false }
          )}

        /></View>


    );
  }




  // handler to clear the locally stored user info (logout) and navigate to the
  // sign in screen
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };


}


export default LogoutScreen;
