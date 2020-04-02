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
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import styles from '../styles/styles';
import {Collapse, CollapseHeader, CollapseBody,AccordionList} from "accordion-collapse-react-native";
import { Thumbnail } from 'native-base';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-material-dropdown';
import{Container,Header,Title,Content,Icon,ListItem,Text,Left,Right,Body,Separator}from'native-base';

class DailyStatusAddScreen extends React.Component {
  static navigationOptions = {
    title: 'Daily Status Add',
  };

  constructor() {
    super();
    var now = new Date();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var day = ("0" + now.getDate()).slice(-2);
    
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
      today: `${now.getFullYear()}-${month}-${day}`
    };
  }

  static navigationOptions=({navigation,screenProps}) => {
  
    return { title: navigation.getParam('otherParam', 'Daily Status Add') ,
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

  async componentDidMount() {
    await this._fetchUserInfo();
    this._fetchPatients();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }
 
  // render content
  // consists of one picker container to choose patient, with several picker items
  // then a date picker for choosing the date to retrieve data from
  // a button is used to trigger data retrieval, and text elements to present the data
  render() {
    
    return (
      <KeyboardAvoidingView behavior='padding' style={{backgroundColor:'#fff', flex:1}}>
      <View style={{backgroundColor:'#fff'}}>
        <ScrollView >
        <Content>
        <Separator bordered={styles2.borderedContent}>
            <Text style={styles2.textContent}>Sanitation Behavior 衛生行為（Freshen up)</Text>
          </Separator>
          <ListItem >
          <View>
            <Collapse style>
              <CollapseHeader style={{flexDirection:'row',alignItems:'flex-start'}}>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Shower</Text>
                  </View>
             </CollapseHeader>
              <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                  <View style={{ paddingTop: 10, alignItems:'center' }}>
                  <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(shower) => this.setState({ shower })}
                      value={this.state.shower}
                    />             
                  </View>
              </CollapseBody>
            </Collapse>
          </View>
          </ListItem>

          <ListItem>
          <View style >
          <Collapse style>
              <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Brush Teeth</Text>
                  </View>
             </CollapseHeader>
              <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                  <View style={{ paddingTop: 10, alignItems:'center' }}>
                  <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(brushTeeth) => this.setState({ brushTeeth })}
                      value={this.state.brushTeeth}
                    />     
                  </View>
              </CollapseBody>
            </Collapse>
          </View>
          </ListItem>

          <ListItem>
          <View style >
          <Collapse>
              <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Shampoo</Text>
                  </View>
             </CollapseHeader>
              <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                  <View style={{ paddingTop: 10, alignItems:'center' }}>
                  <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(Shampoo) => this.setState({ Shampoo })}
                      value={this.state.Shampoo}
                    />     
                  </View>
              </CollapseBody>
            </Collapse>
          </View>
          </ListItem>

         <ListItem>
         <View style={{ paddingTop: 0 }}>
          <Collapse>
              <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>          
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Shave</Text>
                  </View>
             </CollapseHeader>
              <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                  <View style={{ paddingTop: 10, alignItems:'center' }}>
                  <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(Shave) => this.setState({Shave})}
                      value={this.state.Shave}
                    />     
                  </View>
              </CollapseBody>
            </Collapse>
          </View>
         </ListItem>

         <ListItem>
         <View style={{ paddingTop: 0 }}>
          <Collapse >
              <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Haircut</Text>
                  </View>
             </CollapseHeader>
              <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                  <View style={{ paddingTop: 10, alignItems:'center' }}>
                  <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(Haircut) => this.setState({ Haircut })}
                      value={this.state.Haircut}
                    />     
                  </View>
              </CollapseBody>
            </Collapse>
          </View>
         </ListItem>

          <ListItem last>
            <View style >
              <Collapse >
                  <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>
                  <View style={{ paddingTop: 10 }}>
                        <Text style={styles.statusToggle}>Wash Face</Text>
                      </View>
                </CollapseHeader>
                  <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                      <View style={{ paddingTop: 10, alignItems:'center' }}>
                      <TextInput
                          placeholder="Enter Time (format example 13:50)"
                          placeholderTextColor='black'
                          style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                          onChangeText={(face) => this.setState({ face })}
                          value={this.state.face}
                        />     
                      </View>
                  </CollapseBody>
                </Collapse>
          </View>
          </ListItem>

          <Separator bordered={styles2.borderedContent}>
            <Text style={styles2.textContent}>Dietary Condition 飲食狀況</Text>
          </Separator>
          <ListItem>
          <View>
          <Collapse>
              <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Feed Breakfast</Text>
                  </View>
             </CollapseHeader>
              <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                  <View style={{ paddingTop: 10, alignItems:'center' }}>
                  <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(breakfast) => this.setState({ breakfast })}
                      value={this.state.breakfast}
                    />     
                  </View>
              </CollapseBody>
            </Collapse>
          </View>
          </ListItem>

          <ListItem>
            <View>
            <Collapse>
                <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{ paddingTop: 10 }}>
                      <Text style={styles.statusToggle}>Feed Lunch</Text>
                    </View>
              </CollapseHeader>
                <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                    <View style={{ paddingTop: 10, alignItems:'center' }}>
                    <TextInput
                        placeholder="Enter Time (format example 13:50)"
                        placeholderTextColor='black'
                        style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                        onChangeText={(lunch) => this.setState({ lunch })}
                        value={this.state.lunch}
                      />     
                    </View>
                </CollapseBody>
              </Collapse>
          </View>
          </ListItem>

          <ListItem last>
          <Collapse>
                <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{ paddingTop: 10 }}>
                      <Text style={styles.statusToggle}>Feed Dinner</Text>
                    </View>
              </CollapseHeader>
                <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                    <View style={{ paddingTop: 10, alignItems:'center' }}>
                    <TextInput
                        placeholder="Enter Time (format example 13:50)"
                        placeholderTextColor='black'
                        style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                        onChangeText={(dinner) => this.setState({ dinner })}
                        value={this.state.dinner}
                      />     
                    </View>
                </CollapseBody>
              </Collapse>
          </ListItem>

          <Separator bordered={styles2.borderedContent}>
          <Text style={styles2.textContent}>Basic Care 基本護理</Text>
          </Separator>
          <ListItem last>
          <View style={{ paddingTop: 0 }}>
          <Collapse >
              <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Turn Over/Back Care</Text>
                  </View>
             </CollapseHeader>
              <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                  <View style={{ paddingTop: 10, alignItems:'center' }}>
                  <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(Turnover) => this.setState({Turnover})}
                      value={this.state.Turnover}
                    />     
                  </View>
              </CollapseBody>
            </Collapse>
          </View>
          </ListItem>

          <Separator bordered={styles2.borderedContent}>
          <Text style={styles2.textContent}>Defecation / Urination</Text>
          </Separator>    

          <ListItem> 
          <View style={{ paddingTop: 0 }}>
          <Collapse >
            <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>
              
              <View style={{ paddingTop: 10 }}>
                 <Text style={styles.statusToggle}>Poop Time</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{alignItems:'center',justifyContent:'center',flexDirection:'row',padding:4}}>           
              <Collapse style={{flexDirection:'row'}}>
                <CollapseHeader>
                <View style={{ paddingTop: 10, alignItems:'center' }}> 
              
                    <TextInput
                    placeholder="Enter Time (format example 13:00)"
                    placeholderTextColor='black'
                    style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                   onChangeText={(poop) => this.setState({ poop })}
                   value={this.state.poop}
                 />
                  </View>
                </CollapseHeader>
              </Collapse>
            </CollapseBody>
          </Collapse>
          </View>  
        </ListItem> 

            <ListItem last>
            <View style={{ paddingTop: 0}}>
          <Collapse >
            <CollapseHeader style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Urinate Time</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{alignItems:'center',justifyContent:'center',flexDirection:'row',padding:4}}>
              
              <Collapse style={{flexDirection:'row'}}>
                <CollapseHeader>
                <View style={{ paddingTop: 10, alignItems:'center' }}>
                    
                    <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(urinate) => this.setState({ urinate })}
                      value={this.state.urinate}
                    />
                  </View>
                </CollapseHeader>
              </Collapse>
            </CollapseBody>
          </Collapse>
       
          </View>
        

            </ListItem> 
          
          <View style={{marginTop: 10, marginHorizontal: 50, alignSelf: 'auto', flex: 1, justifyContent: 'space-between', fontSize: '10'}}>
            <Button
              onPress={this._submitDailyStatus}
              title="Submit"
              type="solid"
              buttonStyle={{
               
                backgroundColor:'#3f9fff'}}
            />
          </View>
          </Content>
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

    const baseRef = `Activities/${this.props.navigation.getParam('patientID','0')}/${this.state.today}/${this.state.userInfo.ID}/daily_status/`;
    const ref = firebase.database().ref(baseRef);
    const user = this.state.userInfo;
    const now = new Date();

    await ref.remove({
      date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      submittedBy: user.ID,
      shower: this.state.shower,
      breakfast:this.state.breakfast,
      lunch:this.state.lunch,
      dinner:this.state.dinner,
      brushTeeth:this.state.brushTeeth,
      poop: this.state.poop,
      urinate: this.state.urinate,
      face:this.state.face,
      shampoo:this.state.shampoo,
      Haircut:this.state.Haircut,
      Turnover:this.state.Turnover,
      Shave:this.state.Shave
    });
    
    await ref.update({
      date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      submittedBy: user.ID,
      shower: this.state.shower,
      breakfast:this.state.breakfast,
      lunch:this.state.lunch,
      dinner:this.state.dinner,
      brushTeeth:this.state.brushTeeth,
      poop: this.state.poop,
      urinate: this.state.urinate,
      face:this.state.face,
      shampoo:this.state.shampoo,
      Haircut:this.state.Haircut,
      Turnover:this.state.Turnover,
      Shave:this.state.Shave
    });

    this._showPatientRecords();
    Alert.alert('Daily Status Add', 'Successful!');
  }

  _showPatientRecords() {
    this.props.navigation.goBack();
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
    padding: 20,
    marginTop: 15,
  },
  picker: {
    color: 'black',
    fontWeight: 'bold',
  },
  textContent: {
    fontSize: 15,
  },
  borderedContent:{
  padding:10
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