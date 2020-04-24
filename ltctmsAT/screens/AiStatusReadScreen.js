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
import { Text, Card, CardItem } from 'native-base';
import { Button } from 'react-native-elements';

class AiStatusReadScreen extends React.Component {
  static navigationOptions = {
    title: 'AI Status Read',
  };

  constructor() {
    super();

    var now = new Date();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var day = ("0" + now.getDate()).slice(-2);

    this.state = {
      patientList: [],
      patient: '',
      today: `${now.getFullYear()}-${month}-${day}`,
      date: `${now.getFullYear()}-${month}-${day}`,
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

  static navigationOptions=({navigation,screenProps}) => {
  
    return { title: navigation.getParam('otherParam', 'AI Status Read') ,
      headerStyle: {
        backgroundColor: '#003b46',
      },
      headerTintColor: '#c4dfe6',
      };
  };

  // This pulls the current logged in users data that was saved in asyncstorage into state
  // begin fetching content (patients) before the component actually mounts
  componentDidMount() {
    AsyncStorage.getItem("userInfo").then((value) => {
      const data = JSON.parse(value);
      this.state.userID = data.ID;
      this.state.position = data.Position;
    })
    this._fetchPatients();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  // render content
  // consists of one picker container to choose patient, with several picker items 
  // then a date picker for choosing the date to retrieve data from
  // a button is used to trigger data retrieval, and text elements to present the data
  render() {

    return (
      <View style={styles.container}>
        <ScrollView style={styles2.container}>
          
           <Card width={350}>
           <CardItem header bordered>
          <View>
            <Text style={styles.headerText}>Select Date to View AI Status</Text>
          </View>
          </CardItem>
       
          <View style={styles.pickerView} paddingTop={20} paddingBottom={20} >
            <DatePicker
              date={this.state.date}
              mode="date"
              placeholder="Select Date"
              format="YYYY-MM-DD"
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
          </Card>
          <View>
            <Button
              onPress={this._fetchAiStatus}
              title="Submit"
              style={{ padding: 10 }}
              type="solid"
              buttonStyle={{
                backgroundColor:'#07575b'}}
            />
          </View>
          <Card height={100} justifyContent='space-evenly' paddingLeft={20}>
          <View>
            <Text style={styles2.text}>Latest Heart Rate: {this.state.heartRate}</Text>
            <Text style={styles2.text}>Steps Taken: {this.state.steps}</Text>
            <Text style={styles2.text}>Times fallen: {this.state.fallRecord}</Text>
          </View>
          </Card>
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
    firebase.database().ref(`Activities/${(this.state.position == "Patient" ? patient : this.props.navigation.getParam('patientID','0'))}/${this.state.date}`).once('value').then((snapshot) => {

      const data = snapshot.toJSON();
      
      if (data && data.AI) {
        var steps = data.AI.Step.Step;
        var trueSteps = parseInt(steps.slice(8, steps.lastIndexOf('?')).trim());
        var falls = '';
        var heartRate = '';
        var hourFallen = '';
        var minuteFallen = '';
        var secondFallen = '';

        if (data.AI.FallRecord && data.AI.FallRecord.Fell) {
          console.log(data.AI.FallRecord);
          hourFallen = data.AI.FallRecord.Fell.slice(0,2).trim();
          minuteFallen = data.AI.FallRecord.Fell.slice(3,5).trim();
          secondFallen = data.AI.FallRecord.Fell.slice(6,8).trim(); 
          falls = hourFallen.toString() + ":" + minuteFallen.toString() + ":" + secondFallen.toString();
          //falls = parseInt(data.AI.FallRecord.Fell.slice(0, data.AI.FallRecord.Fell.length).trim());
          console.log(falls);
          console.log("falls: " + this.state.fallRecord)
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
  },
  text: {
    fontSize:18,
    padding:4,
    color:'#66a5ad'
  }
});



export default AiStatusReadScreen;