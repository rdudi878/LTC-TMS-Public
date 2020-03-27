/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename: SignInScreen.js                                                                    */
/**********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  Image,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { Button, ThemeProvider, Icon } from 'react-native-elements';
import styles from '../styles/styles';
//import { Header } from 'react-native/Libraries/NewAppScreen';
import { Header } from 'react-navigation-stack';

const { width: WIDTH} = Dimensions.get('window')

class SignInScreen extends React.Component {

  constructor(props) {
    super(props);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    // required state variables to handle user input correctly
    this.state = {
      cnaSwitch: false,
      username: '',
      password: '',
      showPassword: true,
    };
    console.disableYellowBox = true;
  };

  toggleSwitch() {
    this.setState({ showPassword: !this.state.showPassword });
  }
// uncomment header:null to disable header on signin screen
  static navigationOptions = {
    //header: null,
  };

  //  padding: 50, paddingBottom: 50,

  //KeyboardAvoidingView is used to prevent the keyboard from overlaying the View containing the login form,
  // toggle, and buttons
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-510}
      style={{ flex: 1, backgroundColor: '#BAE7FF' }}>
        <View style={styles.containerSignIn}>
          <Image style={styles.logo} source={require('../assets/img/logofinal.png')} />
          <View style={styles_2.inputContainer}>
            <Image style={styles_2.inputIcon} source={{uri: 'https://imgur.com/a01Jwvn.png'}}/>
            <TextInput
              style={styles_2.inputs}
              placeholder="User ID"
              placeholderTextColor='black'
              returnKeyType={"next"}
              onSubmitEditing={()=>this.secondTextInput.focus()}
              onChangeText={(username) => this.setState({ username })}
            />
          </View>
          <View style={styles_2.inputContainer}>
            <Image style={styles_2.inputIcon} source={{uri: 'https://imgur.com/PyFVFqt.png'}}/>
            <TextInput
              style={styles_2.inputs}
              secureTextEntry={this.state.showPassword}
              placeholder="Password"
              placeholderTextColor='black'
              returnKeyType = {"go"}
              ref={(input)=>this.secondTextInput = input}
              onChangeText={(password) => this.setState({ password })}
            />
          </View>
          <Text style = {styles_2.simpleText}>Password Visibility</Text>
          <Switch
            onValueChange = {this.toggleSwitch}
            value = {!this.state.showPassword}
            style = {{marginBottom: 10, marginLeft: 10, alignSelf: 'center'} }
            trackColor={{ true: 'green', false: 'red' }}
          />
          <TouchableHighlight style={[styles_2.buttonContainer, styles_2.loginButton]} onPress={this._signIn}>
            <Text style={styles_2.loginText}>Login</Text>
          </TouchableHighlight>
        </View>
      
      </KeyboardAvoidingView>
    );
  }

  // originally authenticating anonymously with firebase, using API key as only layer of security
  // now we're using API key and email authentication
  async componentDidMount() {

    //const { user } = await firebase.auth().signInAnonymously();
    const { user } = await firebase.auth().signInWithEmailAndPassword('mobileapp@300bps.net', 'totallysecure');
  }
  // Updated 2-14-2019: for both types of sign-ins, there will be an alert prompt if credentials are incorrect
  _signIn = () => {
    userCredentials = firebase.database().ref(`CNA/${this.state.username}/Portfolio/`).once('value').then((snap) => {
      userInfo = snap.val();
      if (snap.val().Password === this.state.password) {
        this._setUserInfo(userInfo);
      } 
      else { 
      Alert.alert('Username/Password incorrect.');
      }
    }).catch(() => {
      userCredentials = firebase.database().ref(`Patient/${this.state.username}/Portfolio/`).once('value').then((snap) => {
        userInfo = snap.val();
        console.log(snap.val());
        if (snap.val().Password === this.state.password) {
          this._setUserInfo(userInfo);
        } else {
          Alert.alert('Username/Password incorrect.');
        }
      }).catch(() => {
        Alert.alert('Username/Password incorrect.');
      });
    }); //catch is added to prompt incorrect credentials
  };

  // helper function to set user information in local storage.
  // Because of the nature of asyncronous calls in JS, an await statement must
  // directly proceed the declaration of an asyncronous function (the first line)
  // within the function's defintion. Without this helper (i.e. with this code
  // directly embedded in this._signIn()), this._signIn() will error out.
  _setUserInfo = async (userInfo) => {
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.props.navigation.navigate('App');
  }
}
const styles_2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:350 ,
      height:45,
      marginBottom:10,
      flexDirection: 'row',
      alignItems:'center',
      alignSelf:'center',
     
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
      color: 'black',
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom:20,
  
    width:300,
    borderRadius:7,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  },
  simpleText: {
    color: 'black',
    alignSelf:'center',
    marginLeft: 10
  },
});

export default SignInScreen;