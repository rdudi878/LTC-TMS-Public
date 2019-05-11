/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename: AnnouncementList.js                                                                                   */
/* Purpose:                                                                              */
/* /*********************************************************************************************/
import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View, Alert, TouchableOpacity, ScrollView } from 'react-native';
import firebase from 'react-native-firebase';
//Added import Collapsible, Accordion, and * for accordion list  for announcements
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';

//Import styles.js to use style sheet from central location
import styles from '../styles/styles';
export default class AnnouncementList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      announcements: []
    }
  }

  // begin fetching content (announcements) before the component actually mounts
  componentWillMount() {
    this._fetchAnnouncements();
  }

  // fetch content (announcements)
  _fetchAnnouncements() {
    // container to convert the DataSnapshot returned by FireBase into an easily
    // traversible array
    const announcementBuilder = [];

    // fetch content
    const announcements = firebase.database().ref('Announcements');
    announcements.once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        // push each announcement onto array

        // TODO: define limit for number of announcements fetched and display in
        // DESC order by date
        const child = childSnapshot.val();
        child.collapsed = true;
        announcementBuilder.push(child);
      });
    }).finally(() => {
      this.setState({
        // set state to the array declared above - if successful, array will have content
        // otherwise will default to an empty array and nothing will be displayed
        announcements: announcementBuilder
      });
      // force the component to update with new content
      //this.forceUpdate();
      console.log(announcementBuilder);
    });
  }

  // render content
  render() {
    return (
      <View>
        <FlatList
          data={this.state.announcements}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyExtractor={(item, index) => item.a_id}
          renderItem={this._renderItem}
          ListHeaderComponent={this.renderHeader}
          extraData={this.state}

        />
      </View>
    );
  }


  FlatListItemSeparator = () => {
    return (
      <View
        style={styles.separator}
      />
    );
  }

  // handler for rendering each item
  _renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={this.toggleCollapse.bind(this, item)}
        >
          <Text style={styles.item}>{item.ATitleIOS}</Text>
        </TouchableOpacity>
        {item.collapsed ?
          <View /> :
          <View>
            {<Text style={styles.announce}>{item.AnnouncementIOS}</Text>}
          </View>}
      </View>
    );
  }

  toggleCollapse(item) {
    item.collapsed = !item.collapsed;
    this.setState({ collapsed: item });
  }

  // handler for rendering the header for the FlatList UI component in use
  renderHeader() {
    return (
      <View>
        <Text style={styles.headerText}>Announcements</Text>
      </View>
    )
  }
}
