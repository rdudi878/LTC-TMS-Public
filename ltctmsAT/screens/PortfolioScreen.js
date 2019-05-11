/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: April 12, 2019                                                             */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:  PortfolioScreen.js                                                                */
/* Purpose: Displays Patient information and allows user to navigate to add daily status or check daily status screen */
/**********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Button, ThemeProvider, Icon } from 'react-native-elements';

import styles from '../styles/styles';

class PortfolioScreen extends React.Component {
  static navigationOptions = {
    title: 'Portfolio',
  };
  constructor() {
    super();
    this.state = {
      position: 'sadf',
      userID: 'afsdaasfd',
      buttonArray: [],
    };
  }

  // This pulls the current logged in users data that was saved in asyncstorage into state

  componentWillMount() {
    AsyncStorage.getItem("userInfo").then((value) => {
      const data = JSON.parse(value);
      this.state.userID = data.ID;
      this.state.position = data.Position;
      this.state.address = data.Address;
      this.state.name = data.Name;
      this.state.room = data.patientRoomNo;
      this.state.nationality = data.Nationality;
      this.state.nationalID = data.NationalID;
      this.state.gender = data.Gender;
      this.state.description = data.BriefDescription;
      this.state.DOB = data.DOB;
      this.state.email = data.Email;
      this.state.admissionReason = data.AdmissionReason;
      this.state.medicalRecord = data.MedicalRecord;

      this.forceUpdate();
    })
  }

  // render content
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles2.container}>
          <Text style={styles.itemPortfolio}>Name: {this.state.name}</Text>
          <Text style={styles.itemPortfolio}>User ID: {this.state.userID}</Text>
          <Text style={styles.itemPortfolio}>Position: {this.state.position}</Text>
          <Text style={styles.itemPortfolio}>Address: {this.state.address}</Text>
          <Text style={styles.itemPortfolio}>Room #: {this.state.room}</Text>
          <Text style={styles.itemPortfolio}>Nationality: {this.state.nationality}</Text>
          <Text style={styles.itemPortfolio}>National ID: {this.state.nationalID}</Text>
          <Text style={styles.itemPortfolio}>Gender: {this.state.gender}</Text>
          <Text style={styles.itemPortfolio}>Brief Description: {this.state.description}</Text>
          <Text style={styles.itemPortfolio}>Date of Birth: {this.state.DOB}</Text>
          <Text style={styles.itemPortfolio}>E-mail Address: {this.state.email}</Text>
          <Text style={styles.itemPortfolio}>Admission Reason: {this.state.admissionReason}</Text>
          <Text style={styles.itemPortfolio}>Medical Records: {this.state.medicalRecord}</Text>
          {(this.state.position == "CNA") ? 
          <View>
                    <Button title="Add Daily Status" type='outline' onPress={this._showDailyStatusAdd} style="padding: 5" />
                    <Button title="Check Daily Status" type='outline' onPress={this._showDailyStatusRead} style="padding: 5" />
                    <Button title="Check AI Status" type='outline' onPress={this._showAiStatusRead} style="padding: 5" />
                    <Button title="Check Vital Status" type='outline' onPress={this._showVitalStatusRead} style="padding: 5" />
          <Button title="Add Vital Status" type='outline' onPress={this._showVitalStatusAdd} style="padding: 5" />
          </View>
          : 
          <View>
          <Button title="Check Daily Status" type='outline' onPress={this._showDailyStatusRead} style="padding: 5" />
                    <Button title="Check AI Status" type='outline' onPress={this._showAiStatusRead} style="padding: 5" />
                    <Button title="Check Vital Status" type='outline' onPress={this._showVitalStatusRead} style="padding: 5" />
          </View>
          }
          <Text></Text>
          <Text></Text>
        </ScrollView>
      </View>
    );
  }

  // handler to navigate to the Portfolio page
  _showDailyStatusRead = () => {
    this.props.navigation.navigate('DailyStatusRead');
  };

  _showDailyStatusAdd = () => {
    this.props.navigation.navigate('DailyStatusAdd');
  }

  _showAiStatusRead = () => {
    this.props.navigation.navigate('AiStatusRead');
  }

  _showVitalStatusRead = () => {
    this.props.navigation.navigate('VitalStatusRead');
  }

  _showVitalStatusAdd = () => {
    this.props.navigation.navigate('VitalStatusAdd');
  }

  // signout user by deleting locally stored user info and navigate back to sign in screen
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}


const styles2 = StyleSheet.create({
  container: {
    backgroundColor: '#e6f3ff',
    flex: 1,
    padding: 20,
    marginTop: 15,
  },
  /*
  item: {
    padding: 4,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1
  },
  announce: {
    padding: 1,
    fontSize: 14,
    flex: 1,
    justifyContent: 'space-evenly'
  },
  header: {
    padding: 10
  },
  headerText: {
    textAlign: 'center',
    justifyContent: 'space-evenly',
    fontSize: 18,
    fontWeight: 'bold',
  }

  */
});


export default PortfolioScreen;