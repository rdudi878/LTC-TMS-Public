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
  TextInput,
  Alert,
  Picker,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity
  
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import Icon2 from 'react-native-vector-icons/Foundation';
import{Container,Header,Title,Content,Icon,Card,CardItem,Text,Left,Right,Body}from'native-base';
import { Thumbnail } from 'native-base';


import styles from '../styles/styles';

class PortfolioScreen extends React.Component {
  static navigationOptions = {
    title: 'Patient Records',
    headerStyle: {
      backgroundColor: '#3f9fff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  constructor() {
    super();
    this.state = {
      patientList: [],
      patient: '',
      patientRoomNo:'',
      patientPic: '',
      position: 'sadf',
      userID: 'afsdaasfd',
      buttonArray: [],
      user_position:'',
      //patientSelected:'true'
    };
  }
  
  
  async _fetchUserInfo() {
    const userInfo = await AsyncStorage.getItem("userInfo");
    this.setState({
      userInfo: JSON.parse(userInfo)
    });
  }
 
  // This pulls the current logged in users data that was saved in asyncstorage into state

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("userInfo").then((value) => {
      const data = JSON.parse(value);
      this.state.userID = data.ID;
      this.state.position = data.Position;
      console.log(this.state.position)
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
      this.state.profile_Pic = data.profilePic;

      this.forceUpdate();
    })

    this._fetchPatients();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }


  // render content
  render() {
    return (
      <View style={styles2.container}>
        <ScrollView style={styles2.container}>
          {(this.state.position == "CNA") ? 
          <View>
            <View>             
              <Text style={styles2.text}>Select Patient:</Text>
              <Picker
                mode='anchor'
                style={styles2.picker, {color:'black'}}
                selectedValue={this.state.patient}
                onValueChange={(itemValue, itemIndex) => {this.setState({ patient: itemValue, isLoading:true})}}
              >
                <Picker.Item  label = "Select Patient" value="patient"/>
                {this.state.patientList.map((item, index) => {
                  return (<Picker.Item label={item.id} value={item.id} key={index}/>)
                })}
              </Picker>
            </View >
            <View>
              <Content padder>
                <Card style={styles.mb}>
                  <CardItem header bordered>
                    <Text>Patient Status</Text>
                  </CardItem>
                  <TouchableOpacity 
                  //disabled={this.state.patientSelected}
                   onPress={this._showDailyStatusAdd}>
                  <CardItem>        
                    <Left>
                      <Icon2
                        active
                        name="clipboard-pencil"
                        style={{ color: "#DD5044" }}
                        size= {40}
                      />
                      <Text>Add Daily Status</Text>
                    </Left>
                    <Right>
                      <Icon name="arrow-forward" 
                      disabled={this.state.patientSelected}
                      onPress={this._showDailyStatusAdd} />
                    </Right>             
                  </CardItem>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._showDailyStatusRead}>
                  <CardItem>        
                    <Left><Icon2
                        active
                        name="clipboard-notes"
                        style={{ color: "#3B579D" }}
                        size= {45}
                      />
                      <Text> Check Daily Status</Text>
                    </Left>
                    <Right>
                      <Icon name="arrow-forward" onPress={this._showDailyStatusRead} />
                    </Right>
                  </CardItem>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._showAiStatusRead}>
                  <CardItem>        
                    <Left>
                      <Icon2
                        active
                        name="heart"
                        style={{ color: "#D62727" }}
                        size= {40}
                      />
                      <Text>Check AI Status</Text>
                    </Left>
                    <Right>
                      <Icon name="arrow-forward" onPress={this._showAiStatusRead} />
                    </Right>
                    
                  </CardItem>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._showVitalStatusAdd}>
                  <CardItem>        
                    <Left>
                      <Icon2
                        active
                        name="pencil"
                        style={{ color: "#55ACEE" }}
                        size= {40}
                      />
                      <Text>Add Vital Status</Text>
                    </Left>
                    <Right>
                      <Icon name="arrow-forward" onPress={this._showVitalStatusAdd} />
                    </Right>
                    
                  </CardItem>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._showVitalStatusRead}>
                  <CardItem>        
                    <Left>
                      <Icon2
                        active
                        name="page"
                        style={{ color: "#DD5044" }}
                        size= {45}
                      />
                      <Text> Check Vital Status</Text>
                    </Left>
                    <Right>
                      <Icon name="arrow-forward" onPress={this._showVitalStatusRead} />
                    </Right>
                    
                  </CardItem>
                  </TouchableOpacity>
                    </Card>
              </Content>  
            </View>
          </View>
          
          : 
          <View>
            <Content padder>
              <Card style={styles.mb}>
                <CardItem header bordered>
                  <Text>Patient Satus</Text>
                </CardItem>
                <TouchableOpacity onPress={this._showDailyStatusRead}>
                <CardItem>        
                  <Left><Icon2
                      active
                      name="clipboard-notes"
                      style={{ color: "#3B579D" }}
                      size= {45}
                    />
                    <Text> Check Daily Status</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" onPress={this._showDailyStatusRead} />
                  </Right>
                </CardItem>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._showAiStatusRead}>
                <CardItem>        
                  <Left>
                    <Icon2
                      active
                      name="heart"
                      style={{ color: "#D62727" }}
                      size= {40}
                    />
                    <Text>Check AI Status</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" onPress={this._showAiStatusRead} />
                  </Right>
                </CardItem>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._showVitalStatusRead}>
                <CardItem>        
                  <Left>
                    <Icon2
                      active
                      name="page"
                      style={{ color: "#DD5044" }}
                      size= {45}
                    />
                    <Text>Check Vital Status</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" onPress={this._showVitalStatusRead} />
                  </Right>
                </CardItem> 
                </TouchableOpacity>
              </Card>
            </Content>
          </View>
          }
        </ScrollView>      
      </View>
    );
  }

  // handler to navigate to the Portfolio page
  _showDailyStatusRead = () => {
    this.props.navigation.navigate('DailyStatusRead',{patientID:this.state.patient});
  };

  _showDailyStatusAdd = () => {
    this.props.navigation.navigate('DailyStatusAdd',{patientID:this.state.patient})
    
  }

  _showAiStatusRead = () => {
    this.props.navigation.navigate('AiStatusRead',{patientID:this.state.patient});
  }

  _showVitalStatusRead = () => {
    this.props.navigation.navigate('VitalStatusRead',{patientID:this.state.patient});
  }

  _showVitalStatusAdd = () => {

    this.props.navigation.navigate('VitalStatusAdd',{patientID:this.state.patient});
  }
  _fetchPatients() {
    // fetch content
    const patientData = [];
    firebase.database().ref('Patient').once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        patientData.push({
          id: childSnapshot.key,
        })
      })/*
      if(this.state.patient == "patient") {
        this.state.patientSelected = false;
      } else {
        this.state.patientSelected = true;
        this.setState({
          patientList: patientData,
          patient: patientData[0].id,
          
        });
      }*/
      this.setState({
        patientList: patientData,
        patient: patientData[0].id,
        
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
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
    marginTop: 1,
  },
  headerText: {
    textAlign: 'center',
    justifyContent: 'space-evenly',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    padding: 20
 
  },
  text: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left', /*select week*/
  },
  
  mb: {
    marginBottom: 15,
    borderColor: 'black'
  },
  picker:{
    paddingTop:-10
  }
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

  */
});


export default PortfolioScreen;