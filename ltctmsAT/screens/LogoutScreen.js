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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import { Button, ThemeProvider } from 'react-native-elements';
import styles from '../styles/styles';
import { Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';

class LogoutScreen extends React.Component {

 

  constructor(props) {
    super(props);
    this.state = {
      userInfo: '',
      position: 'sadf',
      userID: 'afsdaasfd'
    };

  }



/*************************************************************************/
  /* */
  /* Function name: _fetchUserInfo */
  /* Description: Fetch the user info from database and pass it to userInfo */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  async _fetchUserInfo() {
    const userInfo = await AsyncStorage.getItem("userInfo");
    this.setState({
      userInfo: JSON.parse(userInfo)
    });

  }
/*************************************************************************/
  /* */
  /* Function name: componentDidMount */
  /* Description: call _fetchUserInfo function before render() */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  async componentDidMount() {
    await this._fetchUserInfo();
  }

  componentDidUpdate() {
    AsyncStorage.getItem("userInfo").then((value) => {
      const data = JSON.parse(value);
      this.state.userID = data.ID;
      this.state.position = data.Position;
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
      this.state.profile_Pic = data.pictureurl;
      
      this.forceUpdate();
    })
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
      backgroundColor: '#C2CFDB',
      width: screenWidth,
    }
  }


  componentDidMount(){
    this.props.navigation.setParams({navigatePress:this.LogoutButton});
  }
  _logout (){
    AsyncStorage.removeItem('userInfo');
    this.props.navigation.navigate('Auth');
  }
  
 
  render() {
    const user = this.state.userInfo;
    return (
      <View style={styles.container}>
         <ScrollView style={styles2.container}>
        <View>
        <View style={this.headerStyle(Math.round(Dimensions.get('window').width))}></View>
        <Thumbnail style={{width:130,height:130,borderRadius:130/2,alignSelf:'center',position: 'absolute',marginTop:50,borderColor: "white",borderWidth: 4}} source={{uri:this.state.profile_Pic}} />
        <View style={styles2.body}>
          <View style={styles2.bodyContent2}></View>
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

            
            <View style={{marginTop: 5, alignSelf: 'center', flex: 1, justifyContent: 'space-between', fontSize: 10, width: 250}}>                       
            <Button 
            onPress={() => {
              this.props.navigation.navigate('Schedule')
              }}
              title="Your Working Schedule" type='solid' onPress={this._showDailyStatusAdd} 
              buttonStyle={{
              backgroundColor:'#3f9fff'}}/>          
            </View>
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
    color: "#696969",
    fontWeight: "700",
    alignSelf: "center",
    paddingHorizontal:25,
    color: 'black'
    
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10,
    alignSelf:"center",
    paddingHorizontal:25,
  },
  description:{
    fontSize:14,
    color: "#696969",
    marginTop:10,
    textAlign: 'left',
    alignItems:'flex-start',
    paddingHorizontal: 25,
    color: 'black'
  },
  description2:{
    fontSize:14,
    color: "#696969",
    marginTop:10,
    textAlign: 'left',
    alignItems:'center',
    paddingHorizontal: 25,
    color: 'black',
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