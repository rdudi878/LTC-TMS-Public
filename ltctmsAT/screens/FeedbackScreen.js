/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: April 2,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:   FeedbackScreen.js                                                                               */
/* Last Edited By:                                                                          */
/* /*********************************************************************************************/
import React, { Component } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, TouchableOpacity, View, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Title, Content, Text, Icon, Card, CardItem, Item, Body, Right, Button, Input, Form, Textarea, Left } from 'native-base';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';


export default class Feedback extends Component {


  constructor(props) {
    super(props);

    this.state = {
      userInfo: '',
      Content: '',
      feedbackTypeSwitch: false
    };

  }
  /*************************************************************************/
  /* */
  /* Function name: navigationOptions*/
  /* Description: Create a fix title on feedback Screen*/
  /* Parameters: none*/
  /* Return Value: none */
  /* */
  /*************************************************************************/
  static navigationOptions = {
    title: 'Submit Feedback',

    tabBarIcon: ({ tintColor }) => <Icon
      name="ios-stats"
      size={30}
      type="ioncon"
      color={tintColor}
    />

  }

  /*************************************************************************/
  /* */
  /* Function name: _fectUserInfo*/
  /* Description: fetch user info and setstate */
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

  async componentWillMount() {
    await this._fetchUserInfo();
  }


  /*************************************************************************/
  /* */
  /* Function name: postMsg */
  /* Description: call writeFeedbackData function to push data to data baseand clearout data field, display error message if encouter */
  /* Parameters: ID, Email, feedbackType, Content, ContentClear */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  postMsg = async (ID, Email, feedbackType, Content, ContentClear) => {
    if (this.state.Content != null) {

      //call writeFeedbackData function to push data to database
      await writeFeedbackData(ID, Email, Content, feedbackType);
      if (this.state.Content != null) {
        this.refs[ContentClear].setNativeProps({ text: '' });
        this.setState({
          ID: '',
          fbType: '',
          Email: '',
          Content: '',
          isSubmited: true,
          feedbackTypeSwitch: false
        })
      }//alert if something go wrong
      else {
        Alert.alert(
          'Oops !',
          'Something went wrong',
          [
            { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          ],
          { cancelable: false }
        )
      }

    }//alert to prompt user to enter feedback content
    else {
      Alert.alert(
        'Oops !',
        'Press SUBMIT button after entering your Message.',
        [
          { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        ],
        { cancelable: false }
      )
    }

  };
  /*************************************************************************/
  /* */
  /* Function name: _togglePostCard */
  /* Description: set submit to false */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  _togglePostCard() {
    this.setState({
      isSubmited: false
    })
  }


  render() {

    const user = this.state.userInfo;
    //Display the screen
    return (
  
      <Container>

        <Content>


          <Card style={styles.postCard}>
            {this.state.isSubmited ?
              <View>
                <CardItem>
                  <Item>
                    <Icon active name="ios-checkmark-circle" style={{ fontSize: 30, color: '#4CAF50', marginLeft: 5, marginRight: 10 }} />
                    <Text style={{ flex: 1 }}>Thanks for submiting feedback. {"\n"} Have a good day</Text>

                  </Item>
                </CardItem>
                <CardItem>
                  <Left>
                  </Left>
                  <Body>
                    <TouchableOpacity success onPress={() => this._togglePostCard()}>
                      <Icon active name="refresh" style={{ fontSize: 40, color: '#64DD17', marginLeft: 10 }} />
                    </TouchableOpacity>
                  </Body>
                  <Right>
                  </Right>
                </CardItem>
              </View>
              ://display feedback type and feedback box
              <View>
                <Text style={{ paddingTop: 15, fontWeight: 'bold', textAlign: 'center' }}>Feedback Type: {this.state.feedbackTypeSwitch ? 'Center' : 'System'}</Text>
                <Switch
                  onValueChange={(value) => this.setState({ feedbackTypeSwitch: value })}
                  style={{ marginBottom: 10, marginTop: 10, alignSelf: 'center' }}
                  value={this.state.feedbackTypeSwitch}
                  trackColor={{ true: 'green', false: 'blue' }}

                />
                <Form style={{ marginLeft: 20, marginRight: 20 }}>
                  <Textarea rowSpan={5} bordered placeholder="Type your message" onChangeText={(Content) => this.setState({ Content })} ref={'ContentClear'} />
                </Form>
                <CardItem>
                  <Left>
                  </Left>
                  <Body>
                    <Button success onPress={() => this.postMsg(user.ID, user.Email, this.state.feedbackTypeSwitch, this.state.Content, 'ContentClear')}>
                      <Text>SUBMIT</Text>
                    </Button>
                  </Body>
                  <Right>
                  </Right>
                </CardItem>
              </View>
            }
          </Card>
        </Content>
      </Container>
     
    );
  }
}

/*************************************************************************/
/* */
/* Function name: writeFeeedbackData */
/* Description: push data to firebase*/
/* Parameters: _id, email, content, feedbackType*/
/* Return Value: none */
/* */
/*************************************************************************/
writeFeedbackData = async (_id, email, content, feedbackType) => {
  await firebase.database().ref('Feedback/').push({
    userId: _id,
    feedbackType: (feedbackType ? 'Center' : 'System'),
    feedbackText: content,
    userEmail: email,
    replyText: "",
    replyId: "",
    replyTimestamp: "",
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}

//styling 
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#1C97F7',
  },
  alertText: {
    fontSize: 12,
    color: '#ffffff',
  },
  conCard: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
  },
  conCardItem: {
    marginLeft: 5,
    marginTop: 5,
  },
  conDetails: {
    fontSize: 15,
    color: 'black',
    marginLeft: 5,
  },
  postCard: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
    marginBottom: 20,
  
  }
});




