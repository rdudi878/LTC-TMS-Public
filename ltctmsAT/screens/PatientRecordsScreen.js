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
  StyleSheet,
  View,
  TextInput,
  Alert,
  Picker,
  ScrollView,
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
      backgroundColor: '#003b46',
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
      default:true,
      room: [],
      defaultRoom: true,
      rm: ''
      //patientSelected:'true'
    };
  }
  
  
  async _fetchUserInfo() {
    const userInfo = await AsyncStorage.getItem("userInfo");
    this.setState({
      userInfo: JSON.parse(userInfo)
    });
  }

  _fetchRoom() {
    var rooms = [];
    firebase.database().ref("Room").once('value').then((snapshot4) => {
      snapshot4.forEach(function (room) {
        var rm = room.key;
        rooms.push(rm);
      })
       this.setState({room : rooms});
    })
   
  }
 
  // This pulls the current logged in users data that was saved in asyncstorage into state

  async UNSAFE_componentWillMount() {
 
    AsyncStorage.getItem("userInfo").then((value) => {
      const data = JSON.parse(value);
      this.setState ({
        userID : data.ID,
        position : data.Position,
        address : data.Address,
        name : data.Name,
      });


    })
    this._fetchRoom();
    //this._fetchPatients();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  _dailyStatusAdd() {
    return (
      <TouchableOpacity onPress={this._showDailyStatusAdd}>
        <CardItem>  
          <Left>
            <View style={styles2.iconCotainer}>
              <Icon2
                active
                name="clipboard-pencil"
                style={styles2.iconTouchable}
                size= {40}/>
            </View>
            <Text style={styles2.text}>Add Daily Status</Text>
          </Left>
                    
          <Right>
            <Icon 
            name="arrow-forward" 
            disabled={this.state.patientSelected}
            onPress={this._showDailyStatusAdd} />
          </Right>             
        </CardItem>
      </TouchableOpacity>
    );
  }

  _dailyStatusRead() {
    return (
      <TouchableOpacity onPress={this._showDailyStatusRead}>
        <CardItem>        
          <Left>
            <View style={styles2.iconCotainer}>
              <Icon2
                active
                name="clipboard-notes"
                style={{ marginLeft:1, marginTop:2, color: "#3B579D" }}
                size= {45}/>
            </View>
            <Text style={styles2.text}>Check Daily Status</Text>
          </Left>

          <Right>
            <Icon name="arrow-forward" onPress={this._showDailyStatusRead} />
          </Right>
        </CardItem>
      </TouchableOpacity>
                  
    );
  }

  _vitalStatusAdd() {
    return (
      <TouchableOpacity onPress={this._showVitalStatusAdd}>
        <CardItem>        
          <Left>
            <View style={styles2.iconCotainer}>
              <Icon2
                active
                name="pencil"
                style={{ marginLeft:1, marginTop:2, color: "#DD5044" }}
                size= {40}/>
              </View>
            <Text style={styles2.text}>Add Vital Status</Text>   
          </Left>
          
          <Right>
            <Icon name="arrow-forward" onPress={this._showVitalStatusAdd} />
          </Right>          
        </CardItem>
      </TouchableOpacity>
    );
  }

  _vitalStatusRead() {
    return (
      <TouchableOpacity onPress={this._showVitalStatusRead}>   
        <CardItem>        
          <Left>
            <View style={styles2.iconCotainer}>
              <Icon2
                active 
                name="graph-trend"
                style={{marginLeft:1, marginTop:2, color: "#3B579D" }}
                size= {45}/>
            </View>
            <Text style={styles2.text}>Check Vital Status</Text>
          </Left>
          <Right>
            <Icon name="arrow-forward" onPress={this._showVitalStatusRead} />
          </Right>
                    
        </CardItem>
      </TouchableOpacity>
    );
  }

  _aiStatusRead() {
    return (
      <TouchableOpacity onPress={this._showAiStatusRead}>
        <CardItem>        
          <Left>
            <View style={styles2.iconCotainer}>
              <Icon2
                active
                name="heart"
                style={{marginLeft:1, marginTop:6, color: "#D62727" }}
                size= {40}/>
            </View>
            <Text style={styles2.text}>Check AI Status</Text>
          </Left>
          <Right>
            <Icon name="arrow-forward" onPress={this._showAiStatusRead} />
          </Right>
                    
        </CardItem>
      </TouchableOpacity>
    );
  }

  _specialCareAdd() {
    return (
      <TouchableOpacity onPress={this._showSpecialCareAdd}>
        <CardItem>        
          <Left>
            <View style={styles2.iconCotainer}>
              <Icon2
                active
                name="page-add"
                style={{marginLeft:4, marginTop:2, color: "#DD5044" }}
                size= {45}/>
              </View>
            <Text style={styles2.text}>Add Special Care</Text>
          </Left>
          <Right>
            <Icon name="arrow-forward" onPress={this._showSpecialCareAdd} />
          </Right>
                    
        </CardItem>
      </TouchableOpacity>
    );
  }

  _specialCareRead() {
    return (
      <TouchableOpacity onPress={this._showSpecialCareRead}>
        <CardItem>        
          <Left>
            <View style={styles2.iconCotainer}>
              <Icon2
                active
                name="page"
                style={{marginLeft:1, marginTop:3, color: "#DD5044" }}
                size= {45}/>
              </View>
            <Text style={styles2.text}>View Special Care Instructions</Text>
          </Left>
          <Right>
            <Icon name="arrow-forward" onPress={this._showSpecialCareRead} />
          </Right>
        </CardItem> 
      </TouchableOpacity>
    );
  }


  // render content
  render() {
    return (
      <View style={styles2.container}>
        <ScrollView style={styles2.container}>
          {(this.state.position == "CNA") ? 
          <View>
            <View>
            <Card style={styles2.card} marginBottom={5}>
  
          <Picker
                mode='anchor'
                style={styles2.picker}
                selectedValue={(this.state.defaultRoom == true) ? 0 : this.state.rm}
                onValueChange={(itemValue) => this.handleChangeRoom(itemValue)}>
                
                {<Picker.Item label = "Select Room" color="#07575a" value="room"/>} 
                {this.state.room.map((item, index) => {
                  return (<Picker.Item label={item} color="#07575a" value={item} key={index}/>)
                })
              }
              </Picker>
          
        </Card>             
              <Card style={styles2.card} marginTop={18}>
                <Picker
                  mode='anchor'
                  style={styles2.picker}
                  selectedValue={(this.state.default == true) ? 0 : this.state.patient}
                  onValueChange={(itemValue, itemIndex) => {this.handleChange(itemValue)}}>

                  {<Picker.Item  label = "Select Patient" color="#07575a" value="patient"/>}
                  {this.state.patientList.map((item, index) => {
                    return (<Picker.Item label={item} value={item} color="#07575a" key={index}/>)})}
                </Picker>
              </Card>
            </View >
            <View>
              <Content padder>
                <Card style={styles.mb}>
                  <CardItem header bordered style={styles.headerText}>
                    <Text style={styles.headerText} >Patient Status</Text>
                  </CardItem>
                    <View>{this._dailyStatusAdd()}</View>
                    <View>{this._dailyStatusRead()}</View>
                    <View>{this._vitalStatusAdd()}</View>
                    <View>{this._vitalStatusRead()}</View>
                    <View>{this._aiStatusRead()}</View>
                    <View>{this._specialCareAdd()}</View>
                    <View>{this._specialCareRead()}</View>
            
                  </Card>
              </Content>  
            </View>
          </View>
          : 
          <View>
            <Content padder>
              <Card style={styles.mb}>
              <CardItem header bordered style={styles.headerText}>
                    <Text style={styles.headerText} >Patient Status</Text>
                  </CardItem>
                <View>{this._dailyStatusRead()}</View>
                <View>{this._vitalStatusRead()}</View>
                <View>{this._aiStatusRead()}</View>
                <View>{this._specialCareRead()}</View>

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
    if ((this.state.patient == "patient" || this.state.patient == "") && this.state.position == "CNA") {
      Alert.alert("You Have Not Select a Patient");
    } else {
      this.props.navigation.navigate('DailyStatusRead',{patientID:this.state.patient});
    }
  };

  _showDailyStatusAdd = () => {
    if ((this.state.patient == "patient" || this.state.patient == "") && this.state.position == "CNA") {
      Alert.alert("You Have Not Select a Patient");
    } else {
      this.props.navigation.navigate('DailyStatusAdd',{patientID:this.state.patient});
    }
  }

  _showAiStatusRead = () => {
    if ((this.state.patient == "patient" || this.state.patient == "") && this.state.position == "CNA") {
      Alert.alert("You Have Not Select a Patient");
    } else {
      this.props.navigation.navigate('AiStatusRead',{patientID:this.state.patient});
    }
  }

  _showVitalStatusRead = () => {
    if ((this.state.patient == "patient" || this.state.patient == "") && this.state.position == "CNA") {
      Alert.alert("You Have Not Select a Patient");
    } else {
      this.props.navigation.navigate('VitalStatusRead',{patientID:this.state.patient});
    }
  }

  _showVitalStatusAdd = () => {
    if ((this.state.patient == "patient" || this.state.patient == "") && this.state.position == "CNA") {
      Alert.alert("You Have Not Select a Patient");
    } else {
      this.props.navigation.navigate('VitalStatusAdd',{patientID:this.state.patient});
    }
  }

  _showSpecialCareAdd = () => {
    if ((this.state.patient == "patient" || this.state.patient == "") && this.state.position == "CNA") {
      Alert.alert("You Have Not Select a Patient");
    } else {
      this.props.navigation.navigate('SpecialCareAdd',{patientID:this.state.patient});
    }
  }

  _showSpecialCareRead = () => {
    if ((this.state.patient == "patient" || this.state.patient == "") && this.state.position == "CNA") {
      Alert.alert("You Have Not Select a Patient");
    } else {
      this.props.navigation.navigate('SpecialCareRead',{patientID:this.state.patient});
    }
  }
/*
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
        //patient: patientData[0].id,
        
      });
      
    });
        
  }*/

  _fetchPatients() {
    var patientListt = [];
  
  firebase.database().ref(`Room/${this.state.rm}`).once('value').then((snapshot5) => {
    snapshot5.forEach(function (patient) {
      var pat = patient.key;
      patientListt.push(pat);
      console.log(patientListt);
    })
    this.setState({patientList: patientListt});
  }).catch((error) => {
    console.error(error);
    return null;
  });
  }

  handleChange(e) {
    if (e == "patient") {
      Alert.alert("Please Select a Patient")
    }
    this.setState({
      patient: e,
      default:false
    })
    //this.forceUpdate();
  
  }

  handleChangeRoom(e) {

    if (e == "room") {
      this.setState({rm: 0, 
        patientList: []});
      
      Alert.alert("Please Select a Room");
    }else{
      this.setState({
        rm: e,
        defaultRoom: false},this._fetchPatients);
      
  }

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
    fontSize: 20,
    width:250,
    color: '#66a5ad',
    
  },
  
  mb: {
    marginBottom: 15,
    borderColor: 'black'
  },
  picker:{
    height:125, 
    width: 300, 
    alignSelf:'center', 
    borderColor:'#ff5722', 
    marginTop:0, 
    justifyContent:'flex-end'
  },
  card: {
    padding:10, 
    margin:50, 
    marginLeft:12, 
    marginRight:12,
    marginBottom:10

  },
  touchable: {
    borderRadius: 10,
    backgroundColor: 'blue'
  },
  iconCotainer: {
    width: 50,
    height:50,
    borderRadius: 50/2,
    justifyContent:'center',
    alignItems:'center',

    backgroundColor:'#c4dfe6',
  },
  iconTouchable: {
    width: 50,
    height:50,
    justifyContent:'center',
    marginLeft:26,
    marginTop:9,
    color:'#DD5044'
  }

});


export default PortfolioScreen;