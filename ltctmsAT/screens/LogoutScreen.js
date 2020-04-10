/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:                                                                                    */
/* Last Edited By:                                                                              */
/* /*********************************************************************************************/
import React ,{Component}from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Picker
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import { Button, ThemeProvider } from 'react-native-elements';
import styles from '../styles/styles';
import { Thumbnail,Card,CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';

class LogoutScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userInfo: '',
      position: '',
      userID: '',
      room: '',
      patientList:[],
      patient:'',
      default:true,
      loginID:'',
      loginPosition:''
     

    };

  }

  async _fetchUserInfo() {
    const userInfo = await AsyncStorage.getItem("userInfo");
    this.setState({
      userInfo: JSON.parse(userInfo)
    });
    
  }
  _fetchPatients() {
    var patientListt = [];
  
  firebase.database().ref(`Patient`).once('value').then((snapshot5) => {
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
      this.setState({default:true})
    } else {
      this.setState({
        patient: e,
        default:false
      })
      this._fetchPatientData(e);
    }
  }

  _fetchPatientData(patientID) {
    
    firebase.database().ref(`Patient/${patientID}/Portfolio`).once('value').then((snapshot5) => {
    
      var data = snapshot5.toJSON();
      console.log(data.ID);
      this.setState ({
        userID : data.ID,
        position : data.Position,
        address : data.Address,
        name : data.Name,
        room : data.patientRoomNo,
        nationality : data.Nationality,
        nationalID : data.NationalID,
        gender : data.Gender,
        description : data.BriefDescription,
        DOB : data.DOB,
        email : data.Email,
        admissionReason : data.AdmissionReason,
        medicalRecord : data.MedicalRecord,
        profile_Pic : data.pictureurl,
      });
      /*
      snapshot5.forEach(function (patient) {
        var pat = patient.key;
        patientListt.push(pat);
        console.log(patientListt);
      })*/
      //this.setState({patientList: patientListt});
    }).catch((error) => {
      console.error(error);
      return null;
    });
  }
  
 
  // This pulls the current logged in users data that was saved in asyncstorage into state

  async UNSAFE_componentWillMount() {
    this.props.navigation.setParams({navigatePress:this.LogoutButton});
    AsyncStorage.getItem("userInfo").then((value) => {
      const data = JSON.parse(value);
      this.setState ({
        loginID: data.ID,
        userID : data.ID,
        loginPosition: data.Position,
        position : data.Position,
        address : data.Address,
        name : data.Name,
        room : data.patientRoomNo,
        nationality : data.Nationality,
        nationalID : data.NationalID,
        gender : data.Gender,
        description : data.BriefDescription,
        DOB : data.DOB,
        email : data.Email,
        admissionReason : data.AdmissionReason,
        medicalRecord : data.MedicalRecord,
        profile_Pic : data.pictureurl,
      });
    })
  this._fetchPatients();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }
  
  static navigationOptions=({navigation,screenProps}) => {
    const { params ={} }= navigation.state;
    const headerRight = ( 
      <TouchableOpacity onPress={()=>navigation.state.params.navigatePress()}>
        <View style={styles2.iconstyle}>
        <Icon 
            name='logout'
            size= {20}
            color='#c4dfe6'
            />
       </View>
      </TouchableOpacity>
    );
    return { title: navigation.getParam('otherParam', 'User Portfolio') ,
      headerRight,
      headerStyle: {
        backgroundColor: '#003b46',
      },
      headerTintColor: '#c4dfe6',
      
      };
  };

  LogoutButton=()=>{
    Alert.alert('Log out','Are you sure?',
    [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
      {text: 'OK', onPress: () => this._logout ()},
    ],
    )
  }

  headerStyle = function(screenWidth) {
    return {
      height:130,
      backgroundColor: '#C4DFE6',
      width: screenWidth,
    }
  }


  _logout (){
    AsyncStorage.removeItem('userInfo');
    this.props.navigation.navigate('Auth');
  }

  _viewWorkingSchedule() {
    return (
      <View style={{marginTop: 5, alignSelf: 'center', flex: 1, justifyContent: 'space-between', fontSize: 10, width: 250}}>                       
            <Button onPress={this._showWorkingSchedule}
              title="Your Working Schedule" type='solid' 
              buttonStyle={{backgroundColor:'#07575B'}}/> 
                    
            </View>
    );
  }
  
  _showWorkingSchedule = () => {
    console.log("this");
    this.props.navigation.navigate('WorkingSchedule',{patientID:this.state.userID});
  }
  render() {
    
   
    return (
     
      <View style={styles.container}>
        
         <ScrollView style={styles2.container}>
        <View>
        <View style={this.headerStyle(Math.round(Dimensions.get('window').width))}></View>
        <Thumbnail style={{width:130,height:130,borderRadius:130/2,alignSelf:'center',position: 'absolute',marginTop:50,borderColor: "white",borderWidth: 4}} source={{uri:this.state.profile_Pic}} />
        {(this.state.loginPosition == "CNA")? 
        <View>
        <Card style={styles2.card} marginTop={55}>
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
        </View>: <View style={{marginBottom:50}}></View>}

        <View style={styles2.body}>
          <View style={styles2.bodyContent2}></View>
          <Card style={styles2.card}>
            <Text style={styles2.name}>{this.state.name}</Text>
            <Text style={styles2.info}>User ID: {this.state.userID}</Text>
            <Text style={styles2.info}>Position: {this.state.position}</Text>
            <Text style={styles2.description}>Address: {this.state.address}</Text>
            <Text style={styles2.description}>Room #: {this.state.room}</Text>
            <Text style={styles2.description}>Nationality: {this.state.nationality}</Text>
            <Text style={styles2.description}>Gender: {this.state.gender}</Text>
            <Text style={styles2.description}>Brief Description: {this.state.description}</Text>
            <Text style={styles2.description}>Date of Birth: {this.state.DOB}</Text>
            <Text style={styles2.description}>E-mail: {this.state.email}</Text>
            <Text style={styles2.description}>Admission Reason: {this.state.admissionReason}</Text>
            <Text style={styles2.description}>Medical Records: {this.state.medicalRecord}</Text>

            {/*<View style={{marginTop: 5, alignSelf: 'center', flex: 1, justifyContent: 'space-between', fontSize: 10, width: 250}}>                       
            <Button title="Settings" type='solid' onPress={this._showDailyStatusAdd} 
              buttonStyle={{
              backgroundColor:'#3f9fff'}}/>          
              </View>*/}
            </Card>
            {(this.state.loginPosition == "CNA") ? <View>{this._viewWorkingSchedule()}</View>:null}

            
        </View>
        
    </View> 

    </ScrollView> 
    </View>      

        
    );
  }
  // handler to clear the locally stored user info (logout) and navigate to the
  // sign in screen
}



const styles2 = StyleSheet.create({
  container:{
    flex:1,
  },
  iconstyle:{
    paddingRight:20

  },
  header:{ 
  },
  body:{
    marginTop:20, 
  },
  card: {
    padding:10, 
    margin:50, 
    marginLeft:12, 
    marginRight:12,
    marginBottom:10,
    marginTop:-60
  },
  picker:{
    height:125, 
    width: 300, 
    alignSelf:'center', 
    borderColor:'#ff5722', 
    marginTop:20,
    
    justifyContent:'flex-end'
  },
  bodyContent2: {
    flex: 1,
    alignItems: 'center',
    marginTop:-50,
    padding:50,
    marginHorizontal:140
    
    
  },
  bodyContent: {
    flex: 1,
    alignItems: 'flex-start',
    marginTop:-50,
    padding:50,
    marginHorizontal:30,
    
  },
  name:{
    fontSize:25,
    color: '#07575b',
    fontWeight: "700",
    alignSelf: "center",
    paddingHorizontal:25,
    
    
  },
  info:{
    fontSize:16,
    color: "#07575b",
    marginTop:10,
    alignSelf:"center",
    paddingHorizontal:25,
  },
  description:{
    fontSize:14,
    color: "#66a5ad",
    marginTop:10,
    textAlign: 'left',
    alignItems:'flex-start',
    paddingHorizontal: 25,
  },
  description2:{
    fontSize:14,
    color: "#66a5ad",
    marginTop:10,
    textAlign: 'left',
    alignItems:'center',
    paddingHorizontal: 25,
    paddingTop:10
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
    paddingTop:50
  },
});
 


export default LogoutScreen