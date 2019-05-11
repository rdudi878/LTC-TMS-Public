/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename: TaskScreen.js                                                                      */
/* Last Edited By:                                                                              */
/* /*********************************************************************************************/
import React, { Component } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Switch,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Text
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Container, Header, Title, Content, List, Icon, Card, CardItem, Item, Body, Right, Button, Input, Form, Textarea, Left } from 'native-base'
import firebase from 'react-native-firebase';
import styles from '../styles/styles';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';



class TaskScreen extends React.Component {
  static navigationOptions = {
    title: 'Task Library',
  };

  state = {
    userInfo: {},
    tasks: [],
    catList: [],
    fixedTasks: [],
    refreshing: false
  };



  async componentWillMount() {
    // grab and store user information for use later.
    // it is stored in AsyncStorage upon login.
    const userInfo = await this._fetchUserInfo().then((res) => {
      if (res) {
        this.setState({
          userInfo: res
        });
        // fetch tasks related to/assigned to the currently logged in user
        // the user's ID will be used for the query.
        this._fetchAssignedTasks(res.ID);
      }
    });
  }

  // simple retrieval from AsyncStorage.
  // it is stored as a serialized string so must be parsed into
  // JSON in order to use throughout the app
  async _fetchUserInfo() {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      return JSON.parse(userInfo);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // fetches the tasks assigned to the user currently logged in
  _fetchAssignedTasks(userId) {
    // due to the nature of the database design, some data massaging must be done
    // in order to retrieve the proper tasks assigned to the currently logged in user
    var assignedTasks = [];
    var taskCategories = [];
    var fixedTasks = [];
    var position = this.state.userInfo.Position;
    console.log("hello" + userId)
    // pulls all the task categories from firebase and puts them in taskCategories array
    firebase.database().ref("TaskInstruction").once('value').then((snapshot) => {
      snapshot.forEach(function (categories) {
        var cat = categories.key;
        taskCategories.push(cat);
      })
      // pulls all the task ID's assigned to the logged in user
      firebase.database().ref(`${position}/${userId}/AssignedTasks`).once('value').then((snapshot2) => {
        snapshot2.forEach((assigned) => {
          var assignedDef = assigned.val();
          // iterates over the taskCategories and assigned tasks and pulls the task objects 
          for (var index in taskCategories) {
            firebase.database().ref(`TaskInstruction/${taskCategories[index]}/${assignedDef}`).once('value').then((snapshot3) => {
              if (snapshot3.val() != null) {
                const child = snapshot3.val();
                child.collapsed = true;
                child.collapsedStep = true;
                this.populateArray(child)
              } else {

              }
            }).catch((error) => {
              console.error(error);
              return null;
            });
          }
        })
      })
    })
  }

  // sets the state with the promised state from the task fetching function
  promisedSetState = (newState) => {
    return new Promise((resolve) => {
      this.setState(newState, () => {
        resolve()
      });
    });

  }

  // toggles the collapse state for categories of tasks
  toggleCollapse(item) {
    item.collapsed = !item.collapsed;
    this.setState({ collapsed: item })
  }

  // toggles the collapse state for tasks within categories
  toggleCollapseStep(item) {
    item.collapsedStep = !item.collapsedStep;
    this.setState({ collapsedStep: item })
  }

  //takes individual task as parameter and populates fields with appropriate
  populateArray = (task) => {
    counter = 1;
    steps = [];
    while (true) {   // Loop through the steps
      var stepF = "Step" + counter;
      if (task["Step" + counter] != null) {
        var detailedSteps = [];
        var detailedCounter;
        detailedCounter = 1;

        //Get information about the detailed steps
        while (true) {   // Loop through the detailed steps
          if (task["Step" + counter]["DetailedStep" + detailedCounter] != null) {
            detailedSteps[detailedCounter - 1] = task["Step" + counter]["DetailedStep" + detailedCounter];
          } else {
            break;
          }
          detailedCounter++;
        }
        var detailedStepsJSON = JSON.stringify(detailedSteps);

        var stepsData = {
          description: task[stepF]["MDescriptionIOS"],
          name: task[stepF]["MtitleIOS"],
          number: stepF,
          detailedSteps: detailedStepsJSON
        }
        steps[counter - 1] = stepsData;
        steps[counter - 1]['detailedSteps'] = detailedSteps;
      } else {
        break;
      }
      counter++;
    }
    taskData = [{
      taskID: task["TaskID"],
      category: task["Info"]["Category"],
      outline: task["Info"]["OutlineIOS"],
      videoURL: task["Info"]["videoURL"],
      note: task["Info"]["NoteIOS"],
      name: task["Info"]["Title"],
      collapsed: task["collapsed"],
      steps: steps,
    }]
    this.setState({
      fixedTasks: this.state.fixedTasks.concat(taskData)
    })

  }

  createStepText(text, step) {
    return (
      <View key={text.toString()}><Text style={{ fontSize: 20, color: 'grey' }}>Step {step} : {text}</Text></View>
    );
  }

  createDetailText(text, step) {
    return (
      <View key={text.toString()}><Text style={{ fontSize: 14, color: 'black' }}>Detailed Step {step} : {text}</Text></View>
    );
  }

  // renders the individual items into appropriate fields
  _renderItem = ({ item }) => {
    stepsArray = [];
    detailedStepsArray = [];
    for (var i = 0; i < item.steps.length; i++) {
      stepsArray.push(this.createStepText(item.steps[i].name, [i + 1]));
      for (var j = 0; j < item.steps[i].detailedSteps.length; j++) {
        stepsArray.push(this.createDetailText(item.steps[i].detailedSteps[j], [j + 1]));
      }
    }

    return (
      <View>
        <TouchableOpacity
          onPress={this.toggleCollapse.bind(this, item)}
        >
          <Text style={styles.item}>{item.category}</Text>
        </TouchableOpacity>
        {item.collapsed ?
          <View /> :
          <View>
            <TouchableOpacity
              onPress={this.toggleCollapseStep.bind(this, item)}
            >
              <Text style={styles.itemTask}>{item.name}</Text>
            </TouchableOpacity>
            {item.collapsedStep ?
              <View /> :
              <View>
                <TouchableOpacity
                  onPress={this.toggleCollapse.bind(this, item)}
                >
                  <Text style={styles.itemTask}>{item.steps.description}</Text>
                </TouchableOpacity>
                {item.collapsed ?
                  <View /> :
                  <View>
                    {stepsArray}
                  </View>}
              </View>}
          </View>}
      </View>
    )
  }


  // renders the header
  _renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Assigned Tasks</Text>
      </View>
    )
  }

  // renders the flatlist and passes the data elements from state into _renderItem
  render() {
    return (
      <ScrollView style={{ backgroundColor: '#e6f3ff' }}>
        <View style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <FlatList
            style={{ flexGrow: 1 }}
            ref="listRef"
            data={this.state.fixedTasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this._renderItem}
            ListHeaderComponent={this._renderHeader}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                enabled={true}
              />}
            extraData={this.state}

          />
        </View>
      </ScrollView>
    );
  }

}


export default TaskScreen;
