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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { Button, ThemeProvider, Icon } from 'react-native-elements';
import styles from '../styles/styles';
class SignInScreen extends React.Component {

  constructor(props) {
    super(props);

    // required state variables to handle user input correctly
    this.state = {
      cnaSwitch: false,
      username: '',
      password: ''
    };
  };
// uncomment header:null to disable header on signin screen
  static navigationOptions = {
    //header: null,
  };

  //  padding: 50, paddingBottom: 50,

  //KeyboardAvoidingView is used to prevent the keyboard from overlaying the View containing the login form,
  // toggle, and buttons
  render() {
    return (
      <KeyboardAvoidingView behavior='position' style={{ flex: 1, backgroundColor: '#e6f3ff' }}>
        <View style={styles.containerSignIn}>
          <Image style={styles.logo} source={require('../assets/img/logofinal.png')} />
          <Text style={styles.signInHeader}>Sign In</Text>
          <TextInput
            style={styles.loginForm}
            placeholder="Username"
            placeholderTextColor='black'
            onChangeText={(username) => this.setState({ username })}
          />
          <TextInput
            style={styles.loginForm}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor='black'
            onChangeText={(password) => this.setState({ password })}
          />
          <Button
            onPress={this._signIn}
            title="Login"
            type='outline'
          />
          <Text style={styles.userToggle}>Toggle User Login</Text>
          <Text style={styles.userToggle}> {this.state.cnaSwitch ? 'CNA' : 'Family'}</Text>
          <Switch
            onValueChange={(value) => this.setState({ cnaSwitch: value })}
            style={{ marginBottom: 10, marginTop: 10, alignSelf: 'center' }}
            value={this.state.cnaSwitch}
            trackColor={{ true: 'green', false: 'blue' }}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  // originally authenticating anonymously with firebase, using API key as only layer of security
  // now we're using API key and email authentication
  async componentDidMount() {

    //const { user } = await firebase.auth().signInAnonymously();
    const { user } = await firebase.auth().signInWithEmailAndPassword('mobileApp@300bps.net', 'totallysecure');
  }
  // Updated 2-14-2019: for both types of sign-ins, there will be an alert prompt if credentials are incorrect
  _signIn = () => {
    if (this.state.cnaSwitch == true) {
      const userCredentials = firebase.database().ref(`CNA/${this.state.username}/Portfolio/`).once('value').then((snap) => {
        const userInfo = snap.val();
        if (snap.val().Password === this.state.password) {
          this._setUserInfo(userInfo);
        } else {
          Alert.alert('Username/Password incorrect.');
        }
        //catch is added to prompt incorrect credentials
      }).catch(() => {
        Alert.alert('Username/Password incorrect.');
      });
    } else {
      const userCredentials = firebase.database().ref(`Patient/${this.state.username}/Portfolio/`).once('value').then((snap) => {
        const userInfo = snap.val();
        console.log(snap.val());
        if (snap.val().Password === this.state.password) {
          this._setUserInfo(userInfo);
        } else {
          Alert.alert('Username/Password incorrect.');
        }
        //catch is added to prompt incorrect credentials  
      }).catch(() => {
        Alert.alert('Username/Password incorrect.');
      });

    }
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

export default SignInScreen;