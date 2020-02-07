/************************************************************************************************/
/* Author: Soluto Engineering                                                                   */
/* Source: https://blog.solutotlv.com/size-matters/                                             */
/* Used by: LTC-TMS App Team (Peter Shively, Ryen Shearn, Duong Doan, Tyler Bartnick)           */
/* Last Modified: April 4, 2019                                                                 */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename: scaling.js                                                                         */                                           
/* Purpose : Contains equation functions to use in styles.js to properly scale between device   */
/* display sizes. Smartphone and Tablet friendly. Based on 5" display dimensions                */
/*********************************************************************************************  */


import { Dimensions, PixelRatio} from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => width / guidelineBaseWidth * size;
// verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

const verticalScale = size => PixelRatio.roundToNearestPixel((width * size) / 100);


export {scale, verticalScale, moderateScale};