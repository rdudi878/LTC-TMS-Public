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
    KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import styles from '../styles/styles';
import { Text } from 'native-base';
import { Button } from 'react-native-elements';

class VitalStatusAddScreen extends React.Component {
    static navigationOptions = {
        title: 'Add Vital Status',
    };

    constructor() {
        super();

        const now = new Date();

        this.state = {
            patientList: [],
            patient: '',
            today: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
            date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
            CNA: '',
            diastolic: '',
            systolic: '',
            temperature: '',
            userInfo: null,
        };
    }

    updatePatient = (patient) => {
        this.setState({ patient: patient })
    }

    async _fetchUserInfo() {
        const userInfo = await AsyncStorage.getItem("userInfo");
        this.setState({
          userInfo: JSON.parse(userInfo)
        });
      }
    // This pulls the current logged in users data that was saved in asyncstorage into state
    // begin fetching content (patients) before the component actually mounts
    componentWillMount() {
        this._fetchPatients();
        this._fetchUserInfo();

    }

    // render content
    // consists of one picker to choose patient and several status fields to fill out
    // followed by a submit button
    render() {

        return (

            <KeyboardAvoidingView behavior='position' style={{backgroundColor:'#e6f3ff', flex:1}} >
            <View style={{backgroundColor:'#e6f3ff'}}>
                <ScrollView style={styles2.container}>
                    <View>
                        <Text style={styles.item}>Select Patient ID to update status</Text>
                        <Picker
                            mode={'dropdown'}
                            style={styles2.picker}
                            selectedValue={this.state.patient}
                            onValueChange={this.updatePatient}
                            
                            
                        >
                            <Picker.Item label="Select Patient" value="patient" />
                            {this.state.patientList.map((item, index) => {
                                return (<Picker.Item label={item.id} value={item.id} key={index}/>)
                            })}
                        </Picker>
                    
                        <View style={{alignItems:'center'}}>
                        <Text style={styles.itemPortfolio}>Patient Vital Status</Text>
                        <Text style={styles.itemPortfolio}>{'\u2764'} Blood Pressure</Text>
                        </View>
                        <View style={{padding:10, alignItems:'center'}}>
                        <TextInput
                            keyboardType='numeric'
                            placeholder="Enter Systolic Pressure"
                            placeholderTextColor="black"
                            style={{ height: 40, width: 200, borderColor: '#b2d1f1', borderWidth: 2, color:'black',}}
                            onChangeText={(systolic) => this.setState({ systolic })}
                            value={this.state.systolic}
                        />
                        </View>
                        <View style={{padding:10, alignItems:'center'}}>
                        <TextInput
                            keyboardType='numeric'
                            placeholder="Enter Diastolic Pressure"
                            placeholderTextColor='black'
                            style={{ height: 40, width: 200, borderColor: '#b2d1f1', borderWidth: 2, color:'black'}}
                            onChangeText={(diastolic) => this.setState({ diastolic })}
                            value={this.state.diastolic}
                        />
                        </View>
                        <View style={{padding:10, alignItems:'center'}}>
                        <Text style={styles.itemPortfolio}>{'\uD83C\uDF21'}Temperature </Text>
                        <TextInput
                            keyboardType='numeric'
                            placeholder="Enter Temperature in Celcius"
                            placeholderTextColor='black'
                            style={{ height: 40, width: 200, borderColor: '#b2d1f1', borderWidth: 2, color:'black' }}
                            onChangeText={(temperature) => this.setState({ temperature })}
                            value={this.state.temperature}
                        />
                        </View>

                    </View>
                    <View>
                        <Button
                            onPress={this._submitStatus}
                            title="Submit"
                            type="outline"
                            style={{ padding: 10 }}
                        />
                        <Text></Text>
                        <Text></Text>
                    </View>

                </ScrollView>
            </View>
            </KeyboardAvoidingView>

        );
    }

    // submits patient vital status to the firebase database, fires an alert if successful
    _submitStatus = async () => {
        if (this.state.patient == null){
            Alert.alert("Please select a patient")
        } else {
        const systolic = this.state.systolic
        const diastolic = this.state.diastolic
        // adding tilde delimiter between systolic and diastolic
        heart = systolic + "~" + diastolic;
        const temperature = this.state.temperature
        const CNA = this.state.userInfo.ID;
        const baseRef = `Activities/${this.state.patient}/${this.state.today}/${CNA}/vital_status/`;
        const ref = firebase.database().ref(baseRef);
        const user = this.state.userInfo;
        const now = new Date();
        // grabs current time and adds a suffix of 0 to minutes if it's only a single digit
        time = (now.getHours()+":"+ String(now.getMinutes()).padStart(2, "0"));
        // heartKey and tempKey are necessary to assemble our key strings because we can't construct
        // them within the update function
        heartKey = "BloodPressure_"+time;
        tempKey = "Temperature_"+time;
        // variables as keys must be enclosed in brackets for firebase
        await ref.update({
            [heartKey]: heart,
            [tempKey]: temperature,
        });

        Alert.alert('Vital Status Add', 'Successful!');
    }
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
        })
        this.setState({
            patientList: patientData,
            patient: patientData.id
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
        //flex: 1,
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
    headerText: {
        textAlign: 'center',
        justifyContent: 'space-evenly',
        fontSize: 18,
        fontWeight: 'bold',
    },
    picker: {
        color: 'black',
        fontWeight: 'bold',
      },
});



export default VitalStatusAddScreen;