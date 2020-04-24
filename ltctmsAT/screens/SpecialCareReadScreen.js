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
import { Text, Card, CardItem, Content } from 'native-base';
import { Button } from 'react-native-elements';

class SpecialCareReadScreen extends React.Component {


  constructor(props) {
    super(props);
    var patientID = props.navigation.state.params.patientID;
    this.state = {
      patientList: [],
      patient: patientID,
      record: '',
      userID: '',
      position: '',
    };
  }

  updatePatient = (patient) => {
    this.setState({ patient: patient })
  }

  static navigationOptions=({navigation,screenProps}) => {
  
    return { title: navigation.getParam('otherParam', 'Special Care Read') ,
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
      console.log("hiiihih" + data.ID)
      //this.state.userID = data.ID;
      this.state.position = data.Position;
      this.setState({
        userID: data.ID
      })
      this._fetchSpecialCare(this.state.position, data.ID);
    })
    
    //this._fetchSpecialCare(this.state.position, data.ID);
    
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
          <View>
              
              
              <Card>
                <CardItem header bordered>
                  <Text style={styles2.headerBox}>Special Care Instructions # {(this.state.position == "Patient") ? this.state.userID : this.state.patient}</Text>
                </CardItem>
                <CardItem>
                  <Text style={styles2.textBox}>{this.state.record}</Text>
                </CardItem>
              </Card>
              
            </View>
          
        </ScrollView>
      </View>
    );
  }

  _fetchSpecialCare = (position, userID) => {
    patient = ""
    if (this.state.position == "Patient") {
      patient = this.state.userID;
    } else {
      patient = this.state.patient;
    }
    console.log("dddd"+ userID + position);
    firebase.database().ref(`Activities/${(this.state.position == "Patient" ? patient : this.props.navigation.getParam('patientID','0'))}/special_care`).once('value').then((snapshot) => {

      const data = snapshot.toJSON();
      var record = data.specialrecord;

      this.setState({
        record: record,
        patient: this.props.navigation.getParam('patientID','0')
      });
      /*
      

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
      console.error(err);*/
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
  textBox: {
    width: 350,
    color:'#66a5ad'
  },
  headerBox: {
    padding: 4,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    color:'#07575b'
  },
  headerText: {
    textAlign: 'center',
    justifyContent: 'space-evenly',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07575b'
  }
});



export default SpecialCareReadScreen;