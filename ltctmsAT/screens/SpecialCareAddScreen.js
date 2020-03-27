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
    StyleSheet,
    View,
    Alert,
    ScrollView,
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

class SpecialCareAddScreen extends React.Component {
    static navigationOptions = {
        title: 'Add Special Care',
    };

    constructor(props) {
        super(props);
        var patientID = props.navigation.state.params.patientID;
        this.state = {
            patientList: [],
            patient: patientID,         
            specialrecord:'',
            userInfo: null,
        };
        
    }

    static navigationOptions=({navigation,screenProps}) => {
  
        return { title: navigation.getParam('otherParam', 'Special Care Add') ,
          headerStyle: {
            backgroundColor: '#003b46',
          },
          headerTintColor: '#c4dfe6',
          };
      };
   
    

    async _fetchUserInfo() {
        const userInfo = await AsyncStorage.getItem("userInfo");
        this.setState({
          userInfo: JSON.parse(userInfo)
        });
      }
    // This pulls the current logged in users data that was saved in asyncstorage into state
    // begin fetching content (patients) before the component actually mounts
    componentDidMount() {
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
                   
                    <View style={{paddingTop:5}}>
                    <Content padder>
                        <Card style={styles.mb}>
                        <CardItem header bordered>
                            <Text>Special Care Record</Text>
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
        
        const specialrecord=this.state.specialrecord
    
        const baseRef = `Activities/${this.props.navigation.getParam('patientID', '0')}/special_care`;
        console.log(baseRef)
        console.log(this.state.patient + " hi");
        const ref = firebase.database().ref(baseRef);
    
        // grabs current time and adds a suffix of 0 to minutes if it's only a single digit
        // heartKey and tempKey are necessary to assemble our key strings because we can't construct
        // them within the update function

        // variables as keys must be enclosed in brackets for firebase
        await ref.update({
            specialrecord:specialrecord
        });
        this._showPatientRecords();
        Alert.alert('Special Care Add', 'Successful!');
    
    }

_showPatientRecords = () => {
    this.props.navigation.goBack();
};

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



export default SpecialCareAddScreen;