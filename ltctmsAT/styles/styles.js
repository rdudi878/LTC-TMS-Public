/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: March 29,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename: styles.js                                                                       */
/* Purpose: external style sheet to customize components of the application. */
/**********************************************************************************************/
import { StyleSheet, Platform } from 'react-native';
//scale methods used will adjust to display height and width automatically. 
import { scale, verticalScale, moderateScale } from './scaling';

const styles = StyleSheet.create({

  basicView: {
    //style component for views that only require the background color and flex. Used in HomeScreen.js
    flex: 1,
    backgroundColor: '#e6f3ff',
  },

  pickerStyle: {
    // NO LONGER USED -- In-line style attributes must be used for DatePicker

    // style for date picker in DailyStatusAddScreen.js and DailyStatusReadScreen.js
    //color: 'black',
    //  borderColor: 'black',
    // borderWidth: 2,


  },
  pickerView: {
    //view for datepicker that will allow alignSelf to work correctly in DailyStatusReadScreen.js
    alignSelf: 'center',
  },
  pickerItem: {
    fontFamily: 'SFNS Display',
   // color: 'black',
    fontSize: scale(14),

  },
  container: {
    // style for all View components used. Typically the top most view component used
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6f3ff'
  },

  containerAnnounce: {
    // Container for announcements screen on HomeScreen.js
    flex: 1,
    padding: scale(5),
  },

  containerSignIn: {
    // Container for SignInScreen.js  
    padding: scale(20),
    backgroundColor: '#e6f3ff',
  },

  userToggle:
  {
    // style for user login text and buttons for SignInScreen.js
    fontSize: scale(10),
    textAlign: 'center',
    paddingTop: 15,
    color: 'black',
  },

  itemTask:
  {
    padding: 10,
    fontSize: scale(14),
    fontWeight: 'bold',
    fontFamily: 'SFNS Display',
    color: 'black',
  },

  loginForm:
  {
    // style for TextInput component for SignInScreen.js
    height: verticalScale(35),
    color: 'black',
  },
  statusToggle:
  {
    // style for Yes/No toggles for DailyStatusAddScreen.js
    fontSize: scale(14),
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',

  },

  item: {
    // titles for each announcement retrieved from AnnouncementList.js displayed in HomeScreen.js
    padding: 10,
    fontSize: scale(20),
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'SFNS Display',
    color: 'black',
  },

  itemPortfolio: {
    // content for each item in the PortfolioScreen.js
    padding: 5,
    fontSize: scale(14),
    fontWeight: 'bold',
    fontFamily: 'SFNS Display',
    color: 'black',
  },

  announce: {
    // content for each announcement retrieved from AnnouncementList.js and displayed in HomeScreen.js
    padding: 20,
    fontSize: scale(14),
    justifyContent: 'space-evenly',
    fontFamily: 'SFNS Text',
    textAlign: 'center',
    color: 'black',

  },
  header: {
    // header style for larger titles
    padding: 10,
    fontSize: scale(40),
    color: 'black',
  },
  feedbackForm: {
    // not used since native-base implementation
    borderColor: 'black',
    borderWidth: 3,
    width: verticalScale(300),

  },

  headerText: {
    // used for subheaders 
    fontSize: scale(24),
    textAlign: 'center',
    justifyContent: 'space-evenly',
    fontFamily: "SFNS Display",
    fontWeight: "bold",
    padding: 20,
    color: 'black',
  },

  signInHeader: {
    //
    fontFamily: "SFNS Display",
    fontSize: scale(12),
    textAlign: "center",
    fontWeight: "bold",
    color: 'black',
  },

  logo: {
    // Logo will be aligned with display
    alignSelf: 'center',
  },

  separator: {
    // Divider for each announcement on HomeScreen.js
    height: 1,
    width: scale(1000),
    backgroundColor: "black",
  },
  /*
    itemSchedule: {
      //
      padding: 10,
      fontSize: scale(20),
      textAlign:'center',
      fontFamily: 'SFNS Display',
      color: 'black',
    }
  
    */
});

export default styles;