/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:  PortfolioScreen.js                                                                                  */
/* Purpose: CNA is able to update patients' daily status and submit information to the database.  */
/**********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  ScrollView,
  Picker,
  Switch,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text } from 'native-base';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import styles from '../styles/styles';
class DailyStatusAddScreen extends React.Component {
  static navigationOptions = {
    title: 'Daily Status Add',
  };

  constructor() {
    super();

    var now = new Date();

    this.state = {
      patientList: [],
      patient: '',
      showeredAM: false,
      showeredPM: false,
      ateAM: false,
      atePM: false,
      poop: '',
      urinate: '',
      brushTeethAM: false,
      brushTeethPM: false,
      userInfo: null,
      today: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    };
  }

  async _fetchUserInfo() {
    const userInfo = await AsyncStorage.getItem("userInfo");
    this.setState({
      userInfo: JSON.parse(userInfo)
    });
  }

  async componentWillMount() {
    await this._fetchUserInfo();
    this._fetchPatients();
  }

  updatePatient = (patient) => {
    this.setState({ patient: patient })
  }

  // render content
  // consists of one picker container to choose patient, with several picker items
  // then a date picker for choosing the date to retrieve data from
  // a button is used to trigger data retrieval, and text elements to present the data
  render() {
    return (
      <KeyboardAvoidingView behavior='position' style={{backgroundColor:'#e6f3ff', flex:1}}>
      <View style={{backgroundColor:'#e6f3ff'}}>
        <ScrollView >
          <View>
            <Text style={styles.item}>Select Patient ID to add a Daily Status</Text>
            <Picker
              mode='anchor'
              style={styles2.picker}
              selectedValue={this.state.patient}
              onValueChange={this.updatePatient}
            >
              <Picker.Item label="Select Patient" value="patient"/>
              {this.state.patientList.map((item, index) => {
                return (<Picker.Item label={item.id} value={item.id} key={index}/>)
              })}
            </Picker>
          </View>

          <View style={{ paddingTop: 10 }}>
            <Text style={styles.statusToggle}>Showered AM</Text>
            <Text style={styles.statusToggle}> {this.state.showeredAM ? 'Yes' : 'No'}</Text>
            <Switch
              onValueChange={(value) => this.setState({ showeredAM: value })}
              style={{ marginTop: 10, marginBottom: 10, alignSelf: 'center' }}
              value={this.state.showeredAM}
              trackColor={{ true: 'green', false: 'blue' }}
            />
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={styles.statusToggle}>Showered PM</Text>
            <Text style={styles.statusToggle}> {this.state.showeredPM ? 'Yes' : 'No'}</Text>
            <Switch
              onValueChange={(value) => this.setState({ showeredPM: value })}
              style={{ marginBottom: 10, marginTop: 10, alignSelf: 'center' }}
              value={this.state.showeredPM}
              trackColor={{ true: 'green', false: 'blue' }}
            />
          </View>

          <View style={{ paddingTop: 10 }}>
            <Text style={styles.statusToggle}>Ate AM</Text>
            <Text style={styles.statusToggle}> {this.state.ateAM ? 'Yes' : 'No'}</Text>
            <Switch
              onValueChange={(value) => this.setState({ ateAM: value })}
              style={{ marginBottom: 10, marginTop: 10, alignSelf: 'center' }}
              value={this.state.ateAM}
              trackColor={{ true: 'green', false: 'blue' }}
            />
          </View>

          <View style={{ paddingTop: 10 }}>
            <Text style={styles.statusToggle}>Ate PM</Text>
            <Text style={styles.statusToggle}> {this.state.atePM ? 'Yes' : 'No'}</Text>
            <Switch
              onValueChange={(value) => this.setState({ atePM: value })}
              style={{ marginBottom: 10, marginTop: 10, alignSelf: 'center' }}
              value={this.state.atePM}
              trackColor={{ true: 'green', false: 'blue' }}
            />
          </View>

          <View style={{ paddingTop: 10 }}>
            <Text style={styles.statusToggle}>Brush Teeth AM</Text>
            <Text style={styles.statusToggle}> {this.state.brushTeethAM ? 'Yes' : 'No'}</Text>
            <Switch
              onValueChange={(value) => this.setState({ brushTeethAM: value })}
              style={{ marginBottom: 10, marginTop: 10, alignSelf: 'center' }}
              value={this.state.brushTeethAM}
              trackColor={{ true: 'green', false: 'blue' }}
            />
          </View>

          <View style={{ paddingTop: 10 }}>
            <Text style={styles.statusToggle}>Brush Teeth PM</Text>
            <Text style={styles.statusToggle}> {this.state.brushTeethPM ? 'Yes' : 'No'}</Text>
            <Switch
              onValueChange={(value) => this.setState({ brushTeethPM: value })}
              style={{ marginBottom: 10, marginTop: 10, alignSelf: 'center' }}
              value={this.state.brushTeethPM}
              trackColor={{ true: 'green', false: 'blue' }}
            />
          </View>

          <View style={{ paddingTop: 10, alignItems:'center' }}>
            <Text style={styles.statusToggle}>Poop Time</Text>
            <TextInput
              placeholder="Enter Time (format example 13:00)"
              placeholderTextColor='black'
              style={{ height: 40, width: 300, borderColor: '#b2d1f1', borderWidth: 2, color:'black' }}
              onChangeText={(poop) => this.setState({ poop })}
              value={this.state.poop}
            />
          </View>

          <View style={{ paddingTop: 10, alignItems:'center' }}>
            <Text style={styles.statusToggle}>Urinate Time</Text>
            <TextInput
              placeholder="Enter Time (format example 13:50)"
              placeholderTextColor='black'
              style={{ height: 40, width: 300, borderColor: '#b2d1f1', borderWidth: 2, color:'black' }}
              onChangeText={(urinate) => this.setState({ urinate })}
              value={this.state.urinate}
            />
          </View>
        
          <View style={{padding:10}}>
            <Button
              onPress={this._submitDailyStatus}
              title="Submit"
              type="outline"
            />
          </View>
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    )

  }

  // fetch content (patients)
  _fetchPatients() {
    // fetch content
    const patientData = [];
    firebase.database().ref('Patient').once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        patientData.push({
          id: childSnapshot.key,
        })
      })
      this.setState({
        patientList: patientData,
        patient: patientData[0].id
      });
    });
  }

  _submitDailyStatus = async () => {
    const baseRef = `Activities/${this.state.patient}/${this.state.today}/DailyStatuses/`;
    const ref = firebase.database().ref(baseRef);
    const user = this.state.userInfo;
    const now = new Date();

    await ref.update({
      date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      submittedBy: user.ID,
      showeredAM: this.state.showeredAM,
      showeredPM: this.state.showeredPM,
      ateAM: this.state.ateAM,
      atePM: this.state.atePM,
      brushTeethAM: this.state.brushTeethAM,
      brushTeethPM: this.state.brushTeethPM,
      poop: this.state.poop,
      urinate: this.state.urinate
    });

    Alert.alert('Daily Status Add', 'Successful!');
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
  picker: {
    color: 'black',
    fontWeight: 'bold',
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



export default DailyStatusAddScreen;