/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: April 12, 2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:  VitalStatusReadScreen.js                                                          */
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

class VitalStatusReadScreen extends React.Component {
  static navigationOptions = {
    title: 'Check Vital Status',
  };

  constructor() {
    super();

    var now = new Date();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var day = ("0" + now.getDate()).slice(-2);

    this.state = {
      patientList: [],
      patientStatus: [],
      patient: '',
      today: `${now.getFullYear()}-${month}-${day}`,
      date: `${now.getFullYear()}-${month}-${day}`,
      status: [],
      CNAList: [],
      CNA: '',
      userID: '',
      position: '',
      header: '',
      
    };
  }

  _fetchCNA() {
    var cna = [];
    firebase.database().ref(`Activities/${(this.state.position == "Patient") ? this.state.userID: this.props.navigation.getParam('patientID','0')}/${this.state.date}`).once('value').then((snapshot4) => {
      snapshot4.forEach(function (child) {
        var c = child.key;
        cna.push(c);       
      })
       this.setState({CNA : cna[0]});
    })
  }

  updatePatient = (patient) => {
    this.setState({ patient: patient })
  }

  updateCNA = (CNA) => {
    this.setState({ CNA: CNA })
  }

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

  // render content
  // consists of one picker container to choose patient, with several picker items 
  // then a date picker for choosing the date to retrieve data from
  // a button is used to trigger data retrieval, and text elements to present the data
  render() {

    return (
      <View style={styles.container}>
        <ScrollView style={styles2.container}>
          <Card>
            <CardItem header bordered>
          <View>
            <Text style={styles.headerText}>Select Date to View Vital Status</Text>
          </View>
          </CardItem>
          <View style={styles.pickerView} paddingTop={20}>
            <DatePicker
              style={styles2.pickerStyle}
              date={this.state.date}
              mode="date"
              placeholder="Select Date"
              format="YYYY-MM-DD"
              minDate="2018-1-1"
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
          <View style={{justifyContent: 'space-between', fontSize: '10', margin:10}}>
            <Button
              onPress={this._fetchCNA(),this._fetchStatus}
              title="Submit"
              type="solid"
              buttonStyle={{
                backgroundColor:'#07575B'}}
            />
          </View>
          <Card>
          <View style={styles.container}>
            <Text style={style={fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 5, color:'#07575b'}}>{this.state.header}</Text>
            <Text style={styles2.status}>{this.state.status}</Text>
          </View>
          </Card>
        </ScrollView>
      </View>

    );
  }
  // formats item data and pushes into an array 
  populateArray = (item) => {
    var status = [];
    JSONitem = JSON.stringify(item)
    str = item.key
    var res = str.split("_")
    console.log(res)
    if (res[0] == "BloodPressure") {
      heart = JSONitem.split('~')
      status.push('\u2764' + "Blood Pressure \n"
        + "Time : " + res[1] + '\n'
        + "Systolic : " + heart[0].slice(1) + '\n'
        + "Diastolic : " + heart[1].slice(0, -1) + '\n\n'
      );
    } else if (res[0] == "Temperature") {
      status.push('\uD83C\uDF21' + "Temperature \n"
        + "Time : " + res[1] + '\n'
        + "Measured : " + JSONitem.slice(1, -1) + "\u2103" + '\n');
    }
    this.setState({
      
      status: this.state.status.concat(status)
      //status: status
    })
    //console.log("res : " + res + JSONitem)

  }

  static navigationOptions=({navigation,screenProps}) => {
  
    return { title: navigation.getParam('otherParam', 'Vital Status Read') ,
      headerStyle: {
        backgroundColor: '#003b46',
      },
      headerTintColor: '#c4dfe6',
      };
  };

  _fetchStatus = () => {
    
    // clears this.state.status so we don't endlessly concat to array with every button press
    this.setState({
      status: ""
    })    
    this._fetchCNA();
    firebase.database().ref(`Activities/${(this.state.position == "Patient" ? this.state.userID : this.props.navigation.getParam('patientID','0'))}/${this.state.date}/${this.state.CNA}/vital_status`).once('value').then((snapshot) => {
      console.log("snapshot" + snapshot.val());
      if (snapshot.val() == null) {
        Alert.alert('Unable to find data for the specified date and patient combination. Please try another one.')
      } else {
        snapshot.forEach((childSnapshot) => {
          this.populateArray(childSnapshot)
        })
        this.setState({
          header: "Patient Vital Status"
        })
      }
        
    })

     
    
    this.forceUpdate();

  }



  // fetch content (patients)
  _fetchPatients() {
    // fetch content
    const patientData = [];
    const patients = firebase.database().ref('Patient');
    patients.once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        patientData.push({
          id: childSnapshot.key,
        })
        this.setState({
        patientList: patientData,
        patient: patientData.id
      })
      })

      
    });
  }

  _fetchCNAs() {
    // fetch content
    const CNAData = [];
    const CNAs = firebase.database().ref('CNA');
    CNAs.once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        CNAData.push({
          id: childSnapshot.key,
        })
      })
      this.setState({
        CNAList: CNAData,
        CNA: CNAData.id
      })
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
  announce: {
    padding: 1,
    fontSize: 14,
    flex: 1,
    justifyContent: 'space-evenly'
  },
  header: {
    padding: 10
  },
  picker: {
    color: 'black',
  },
  headerText: {
    textAlign: 'center',
    justifyContent: 'space-evenly',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerStyle: {
    color: 'black',
    marginBottom: 20
  },
  status: {
    color:'#66a5ad',
    fontSize:18
  }
});



export default VitalStatusReadScreen;