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
import { ListRow,Input } from 'teaset';
import{Form, Textarea,Card,Content,CardItem}from'native-base'
import Moment from 'moment';

class VitalStatusAddScreen extends React.Component {
    static navigationOptions = {
        title: 'Add Vital Status',
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
            CNA: '',
            diastolic: '',
            systolic: '',
            temperature: '',
            specialrecord:'',
            userInfo: null,
            
        };
    }

    checkDate() {
        const now = new Date();
        if(now.getDate() < 10) {
            return "0"+ now.getDate();
        } else {
            return now.getDate();
        }
    }

    checkMonth() {
        const now = new Date();
        if(now.getMonth() < 10) {
            //return month;
            return "0" + now.getMonth();
        } else{
            return now.getDate();
        }
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

            <KeyboardAvoidingView behavior='position' style={{backgroundColor:'#fff', flex:1}} >
            <View style={{backgroundColor:'#fff'}}>
                <ScrollView style={styles2.container}>
                    <View>

                        <ListRow title='Enter Systolic Pressure' style={padding=10}        
                        detail={
                            <Input
                            style={{width: 100,  textAlign: 'right',height: 30,borderColor: '#b2d1f1', borderWidth: 2}}
                            onChangeText={(systolic) => this.setState({ systolic })}
                            value={this.state.systolic}/>                      
                        }
                        />
                        
                        <ListRow title='Enter Diastolic Pressure' detail={
                            <Input
                            style={{width: 100,  textAlign: 'right',height: 30,borderColor: '#b2d1f1', borderWidth: 2}}
                            onChangeText={(diastolic) => this.setState({ diastolic })}
                            value={this.state.diastolic}/>
                        }/>

                        <ListRow title='Enter Temperature in Celcius' detail={
                            <Input
                            style={{width: 100,  textAlign: 'right',height: 30,borderColor: '#b2d1f1', borderWidth: 2}}
                            onChangeText={(temperature) => this.setState({ temperature })}
                            value={this.state.temperature}/>
                        }/>
                    </View>
                    <View style={{paddingTop:20}}>
                    <Content padder>
                        <Card style={styles.mb}>
                        <CardItem header bordered>
                            <Text>Special Case Record</Text>
                        </CardItem>
                        <CardItem> 
                        <Form style={{flex:1,flexDirection:"column"}}>
                                <Textarea rowSpan={10} bordered placeholder="Desciption of Ailment(Ex. Patient today’s poor breath) " onChangeText={(specialrecord) => this.setState({ specialrecord })} 
                                value={this.state.specialrecorde}/>
                            </Form>       
                                            
                        </CardItem>
                        </Card>
                  </Content>

                    </View>
                    <View style={{marginTop: 20, alignSelf: 'center', flex: 1, fontSize: 10, width: 250}}>
                        <Button
                            onPress={this._submitStatus}
                            title="Submit"
                            type="solid"
                            buttonStyle={{
                             backgroundColor:'#3f9fff'}}
                        />
                    </View>

                </ScrollView>
            </View>
            </KeyboardAvoidingView>

        );
    }

    // submits patient vital status to the firebase database, fires an alert if successful
    _submitStatus = async () => {
        if (this.props.navigation.getParam('patientID','0') == null){
            Alert.alert("Please select a patient")
        } else {
        const systolic = this.state.systolic
        const diastolic = this.state.diastolic
        // adding tilde delimiter between systolic and diastolic
        heart = systolic + "~" + diastolic;
        const temperature = this.state.temperature
        const specialrecord=this.state.specialrecord
        const CNA = this.state.userInfo.ID;
        const baseRef = `Activities/${this.props.navigation.getParam('patientID','0')}/${this.state.today}/vital_status/`;
        console.log(baseRef)
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
            specialrecord:specialrecord
        });
        this._showPatientRecords();
        Alert.alert('Vital Status Add', 'Successful!');
    }
    }

_showPatientRecords = () => {
    this.props.navigation.goBack();
};

_submit() {
    this._submitStatus();
    this._showPatientRecordsScreen();
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
     
        marginTop: 5,
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
      mb: {
        marginBottom: 20
      },
});



export default VitalStatusAddScreen;