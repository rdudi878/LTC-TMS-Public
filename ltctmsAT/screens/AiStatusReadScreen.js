/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: April 12, 2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:  DailyStatusReadScreen.js                                                          */
/* Purpose: User is able to select the date and view patients daily status                      */
/**********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Alert,
  ScrollView,
  Picker,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import styles from '../styles/styles';
import { Text } from 'native-base';
import { Button } from 'react-native-elements';

class AiStatusReadScreen extends React.Component {
  static navigationOptions = {
    title: 'AI Status Read',
  };

  constructor() {
    super();

    const now = new Date();

    this.state = {
      patientList: [],
      patient: '',
      today: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      fallRecord: '',
      heartRate: null,
      location: null,
      steps: null,
      userID: '',
      position: '',
    };
  }

  updatePatient = (patient) => {
    this.setState({ patient: patient })
  }

  // This pulls the current logged in users data that was saved in asyncstorage into state
  // begin fetching content (patients) before the component actually mounts
  componentWillMount() {
    AsyncStorage.getItem("userInfo").then((value) => {
      const data = JSON.parse(value);
      this.state.userID = data.ID;
      this.state.position = data.Position;
    })
    this._fetchPatients();
  }

  // render content
  // consists of one picker container to choose patient, with several picker items 
  // then a date picker for choosing the date to retrieve data from
  // a button is used to trigger data retrieval, and text elements to present the data
  render() {

    return (
      <View style={styles.container}>
        <ScrollView style={styles2.container}>
          <View>
          {(this.state.position == "Patient") ?
            <View>
              <Text style={styles.item}>Select Date to View AI Status</Text>
            </View>
            :
            <View>
            <Text style={styles.item}>Select Patient ID to View AI Status</Text>
            <Picker
              mode={'dropdown'}
              selectedValue={this.state.patient}
              style={styles2.picker}
              onValueChange={this.updatePatient}
            >
              <Picker.Item label="Select Patient" value="patient" color="black" />
              {this.state.patientList.map((item, index) => {
                return (<Picker.Item label={item.id} value={item.id} key={index} />)
              })}
            </Picker>
            </View>}
          </View>

          <View style={styles.pickerView}>
            <DatePicker
              date={this.state.date}
              mode="date"
              placeholder="Select Date"
              format="YYYY-M-D"
              minDate="2019-1-01"
              maxDate={this.state.today}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={(date) => { this.setState({ date: date }) }}
            />
          </View>
          <View>
            <Button
              onPress={this._fetchAiStatus}
              title="Submit"
              type="outline"
              style={{ padding: 10 }}
            />
          </View>
          <View>
            <Text></Text>
            <Text></Text>
            <Text>Latest Heart Rate: {this.state.heartRate}</Text>
            <Text>Steps Taken: {this.state.steps}</Text>
            <Text>Times fallen: {this.state.fallRecord}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  _fetchAiStatus = () => {
    patient = ""
    if (this.state.position == "Patient") {
      patient = this.state.userID;
    } else {
      patient = this.state.patient;
    }
    const patientStatus = [];
    firebase.database().ref(`Activities/${patient}/${this.state.date}/`).once('value').then((snapshot) => {

      const data = snapshot.toJSON();

      if (data && data.AI) {
        var steps = data.AI.Step.Step;
        var trueSteps = parseInt(steps.slice(8, steps.lastIndexOf('?')).trim());
        var falls = '';
        var heartRate = '';

        if (data.AI.FallRecord && data.AI.FallRecord.Fell) {
          falls = parseInt(data.AI.FallRecord.Fell.slice(11, data.AI.FallRecord.Fell.length).trim());
        }

        if (data.AI.HeartRate) {
          heartRate = Math.round(parseFloat(data.AI.HeartRate.LastestHeartRate.slice(11, data.AI.HeartRate.LastestHeartRate.length).trim()));
        }

        this.setState({
          fallRecord: falls || '',
          heartRate: heartRate || '',
          location: data.AI.Location || '',
          steps: trueSteps || ''
        });
      } else {
        Alert.alert('No AI status data for given date');
      }



    }).catch((err) => {
      console.error(err);
    });
    this.forceUpdate();
  }

  // fetch content (patients)
  _fetchPatients() {
    // fetch content
    const patientList = [];
    const patients = firebase.database().ref('Patient');
    patients.once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        patientList.push({
          id: childSnapshot.key,
        });
      });
      this.setState({
        patientList: patientList,
        patient: patientList.id
      });
    });
  }



  // signout user by deleting locally stored user info and navigate back to sign in screen
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}


const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 15,
  },
  item: {
    padding: 4,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1
  },
  picker: {
    color: 'black'
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
});



export default AiStatusReadScreen;