/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: April 11, 2019                                                             */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:   WorkingScheduleScreen.js                                                          */
/* Purpose: */
/**********************************************************************************************/
import React, { Component } from 'react';
//import { Dimensions } from 'react-native-scalable-image';
import {
  ActivityIndicator,
  AppRegistry,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  Image,
  Linking,
  Picker,
  ScrollView,
  Dimensions,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';

import styles from '../styles/styles';
import Ioicons from 'react-native-vector-icons/Ionicons';
import { Button, ThemeProvider, Icon } from 'react-native-elements';
import { ListItem, Card, CardItem } from 'native-base';

const{height}=Dimensions.get("window");

class WorkingSchedule extends React.Component {
  static navigationOptions = {
    title: 'Working Schedule',
    headerStyle: {
      backgroundColor: '#003b46',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  

  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      selectedDate: '',
      centerSchedule: [],
      dateKeys: [],
      screenHeight:0,
    }
  }
  onContentSizeChange=(contentWidth,contentHeight)=>{
    this.setState({screenHeight:contentHeight});

  };
/*************************************************************************/
  /* */
  /* Function name: componentWillMount */
  /* Description: call getItems() and _fetchDates() function before render() */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  componentDidMount() {
    this.getItems();
    this.updateWeek();
    this._fetchDates();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  /*************************************************************************/
  /* */
  /* Function name: updateWeek */
  /* Description: update the week schedule as the week as pick from the select weeks */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  updateWeek = (selectedDate) => {
    console.log(selectedDate);
    this.setState({ selectedDate: selectedDate })
    const ref = firebase.database().ref(`/CNA/330001/Schedule/`);
 
    var data = [];
    ref.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        console.log("key " + childSnapshot.key)
        if (childSnapshot.key == "Sunday") {
          data[0] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Monday") {
          data[1] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Tuesday") {
          data[2] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Wednesday") {
          data[3] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Thursday") {
          data[4] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Friday") {
          data[5] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Saturday") {
          data[6] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
      });

      this.setState({ centerSchedule: data });
    });
  
  }
/*************************************************************************/
  /* */
  /* Function name: convertDatesToArray */
  /* Description: Convert Dates to Array */
  /* Parameters: obj */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  convertDatesToArray(obj) {
    const arr = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        var newObj = {};
        newObj[prop] = obj[prop]
        arr.push(newObj);
      }
    }
    return arr;
  }
/*************************************************************************/
  /* */
  /* Function name: getDatesWithin6Months */
  /* Description: Sort out weeks that fall within 6 months with current date */
  /* Parameters: dates */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  getDatesWithin6Months(dates) {
    return dates.filter((date) => {

      for (prop in date) {
        if (date.hasOwnProperty(prop)) {
          var old = new Date();
          old.setMonth(old.getMonth() - 6);

          var future = new Date();
          future.setMonth(future.getMonth() + 6);

          var currDate = new Date(prop);
          return currDate > old && currDate < future
        }
      }
      return false;
    });
  }

  
/*************************************************************************/
  /* */
  /* Function name: _fetchDates() */
  /* Description: Fetch all the weeks, get week schedule within 6 months, and dsiplay weeks in select week */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  _fetchDates() {
    var date = [];
    const ref = firebase.database().ref('/CNA/330001/Schedule');
    ref.once("value", (snapshot) => {
      console.log("snapshot")
      console.log(snapshot)
      dateKeys = snapshot._childKeys;
      console.log ("date keys "+ dateKeys)
      date = snapshot.toJSON();
      var dates = this.getDatesWithin6Months(this.convertDatesToArray(date));
      for (var i = 0; i < dates.length; i++) {
        console.log("dates i")
        console.log(dates)
        dates[i].id = String(i + 1);
        dates[i].key = dateKeys[i]
      }
      this.setState({ dates: dates })
    })
  }
/*************************************************************************/
  /* */
  /* Function name: getItem() */
  /* Description: Get the latest week schedule in the database and set the days in the array centerSchedule*/
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  getItems() {
    const ref = firebase.database().ref('/CNA/330001/Schedule');
    var data = [];
    ref.orderByKey().limitToLast(1).once("child_added", (snapshot) => {
      this.setState({selectedDate:snapshot.key})
      snapshot.forEach((childSnapshot) => {
        console.log("key " + childSnapshot.key)
        if (childSnapshot.key == "Sunday") {
          data[0] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Monday") {
          data[1] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Tuesday") {
          data[2] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Wednesday") {
          data[3] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Thursday") {
          data[4] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Friday") {
          data[5] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
        if (childSnapshot.key == "Saturday") {
          data[6] = ({
            id: childSnapshot.key,
            value: childSnapshot.val(),
          });
        }
      });

      this.setState({ centerSchedule: data });
    });
  }
  /*************************************************************************/
  /* */
  /* Function name: _renderItem */
  /* Description: display the schedule */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  _renderItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles2.item}> {item.id}</Text>
        <Text style={styles2.item2}> {item.value}</Text>
        
      </View>

    )

  }


  
  render() {
    console.log("this state datessdasd")
    console.log(this.state.dates);
    const scrollEnabled=this.state.screenHeight>height;
    return (
      //center schedule and contact center
      <SafeAreaView style={styles.container}>
        <ScrollView>
        <View style={styles2.container}
          contentContainerStyle={styles.ScrollView}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
        >
        
          
          <Text style={styles2.headerText}>Your Working Schedule</Text>
          
         {/* <Card style={styles2.card} marginBottom={17}>
          
            <CardItem header bordered>
              <Text style={styles2.text}>Select Week</Text>
              </CardItem>
          
            <View>
            <Picker
              mode={'dropdown'}
              selectedValue={this.state.selectedDate}
              style={styles2.picker}
              onValueChange={this.updateWeek}
            >
              
              {this.state.dates.map((item, index) => {
                return (<Picker.Item label={item.key} value={item.key} key={index} color={'#66A5AD'} />)
              })}
            </Picker></View>
          
            </Card>*/}
          <Card height={275} justifyContent='space-between'> 
          <FlatList
          marginTop={5}
            data={this.state.centerSchedule}
            keyExtractor={item => item.id}
            renderItem={this._renderItem}
            extraData={this.state.selectedDate}
            
          /></Card>
          
         
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } 
}
//change property of iconss
/*class IconWithBadge extends React.Component {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <Ionicons name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{

              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: 'red',
              borderRadius: 6,
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  }
}*/

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    marginTop: 1,
  }, 
  card: {
    height:200,
    width:370,
    
    
  },
  picker: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    justifyContent:'flex-start'
  },
  item: {
    padding: 7,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    color: '#66A5AD',
    flexDirection: 'row',
  },
  item2: {
    padding: 1,
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    color: '#66A5AD',
    textAlign: 'left',
    flexDirection: 'row',
  },
  
  announce: {
    padding: 1,
    fontSize: 18,
    flex: 1,
    justifyContent: 'space-between'
  },
  header: {
    padding: 1
  },
  text: {
    fontSize: 22,
    color: '#66A5AD',
    fontWeight: 'bold',
    textAlign: 'left', /*select week*/
  },
  headerText: {
    textAlign: 'center',
    justifyContent: 'space-evenly',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#07575B',
    padding: 20,
  }
});

export default WorkingSchedule;
