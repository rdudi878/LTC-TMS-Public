#****************************************************************#
# Author: MCU and KU Students                                    #
# Major: Information Technology                                  #
# Creation Date: Spring 2019                                     #
# Due Date: N/A                                                  #
# Course: CSC355                                                 #
# Professor Name: Dr. Tan                                        #
# Assignment: LTC-TMS Project                                    #
# Filename: Microbit.py                                          #
# Language: Python 3                                             #
# Purpose:  Creating a program that permits the sending/         #
#           receiving data between the micro:bits to the         #
#           database                                             #
#                                                                #
# To run the program you must know the file location and         #
# then cd to that location using putty on the acad server.       #      
# Then you will enter "python Microbit.py".                      #
#****************************************************************#

import threading
import sys
import Adafruit_DHT
import datetime
from firebase import firebase
import serial, time
import time
import Adafruit_ADS1x15
import pyrebase


#**********************************************************************#
#                                                                      #  
# Function Name: infiniteloop1                                         #
# Description: This function listens for data from a serial port,      #
#              formats it, and pushes the data to Firebase for         #
#              storage.                                                #
# Parameters:  N/A - It takes in data via serial port, not parameters  #
# Return Value: N/A - There is nothing to return for another function, #
#               it pushes the data straight to Firebase                #
#                                                                      #
#**********************************************************************#

def infiniteloop1():

    #variable for setup the fireBase app for sending notifications
    config = {
      "apiKey": "AIzaSyDTQfbN-Ag-GN1z0pI-kIRnc4LtUB83NPw",
      "authDomain": "csc354-a604d.firebaseapp.com",
      "databaseURL": "https://csc354-a604d.firebaseio.com",
      "projectId": "csc354-a604d",
      "storageBucket": "csc354-a604d.appspot.com",
      "messagingSenderId": "786974548917",
      "appId": "1:786974548917:web:504b52b9ef22062c9daffc",
      "measurementId": "G-8KLJLYJMS2"
    };
    #configuration
    fireBase = pyrebase.initialize_app(config)
    dbref = fireBase.database()
    
    #set variable ftime for 1 st time patient falls
    ftime = 1
    
    #prompt the user for associated patient ID and room number
    _patient_ID = input("enter patient ID: ")
    _room_num = input("enter room number: ")
    while True: 
    
        #create a variable called port that will contain the port we are connecting to used to connect our computer to the micro:bit
        port = "/dev/ttyACM0"
        #store the connection
        baud = 115200
        #to configure our serial port and the speed of connection
        s = serial.Serial(port)
        s.baudrate = baud

        #our firebase url
        #url = "https://share-b7589.firebaseio.com/"

        #browser firebase instance
        url = "https://csc354-a604d.firebaseio.com/"
        fb = firebase.FirebaseApplication(url, None)

        #read the lines of data being sent via the serial connection and saving it as variable data
        data = s.readline()

        data = str(data.strip())# convert data to a string
        print(data)###
        sptdata = data.strip("'").split(',')# splits the data with a comma with removing the last ' for fall data
        
        #sending data when there are step count and fall data available
        if (len(sptdata) ==4):
            #step count is at index 2    
            stepdata = sptdata[2]  
            
            #7 variables for time after reading received data
            tm = str(time.strftime("%H~%M"))
            ltm = str(time.strftime("%H:%M"))# hours, Minutes
            tms = str(time.strftime("%H~%M~%S"))#hours, minutes, seconds
            dt = str(time.strftime("%Y-%m-%d"))#Year, month, day
            onlyh = str(time.strftime("%H"))#hours
            onlym = str(time.strftime("%M"))#minutes
            falltime = str(datetime.datetime.now()) #the datetime for notifications if needed

            #variables for different time formats? sending to database
            x = tm + "?" + "→"+ "?" + stepdata + "?" + "steps"
            y = "Time:" + tm
            
            #fall detection is at index 3
            falldata = sptdata[3]
            if (falldata == '1'):
                f = tms + "?" + "→" + "?"+ falldata 
                #send fall detection value to Firebase
                fb.put("/Activities"+"/"+_patient_ID+"/"+ dt +"/AI" +"/FallRecord", "Fell"+ str(ftime) +"/", f)
            
                post_ref = dbref.child('Notifications')      #setup a post variable for sending data to specific branch in DB
                
                #send notifications to database as fall detection, and put a caution on screen
                post_key_ref = post_ref.push({
                    'Patient ID': _patient_ID,
                    'Datetime': falltime,
                    'Status': 'Fell for the ' + str(ftime) + " time in that day" + ", in Room " + str(_room_num)
                })
                #send notifications to CNA also
                all_CNA = dbref.child("CNA").get() # get all CNA IDs
                notID = list(post_key_ref.values())[0]
                for cna in all_CNA.each():
                    loc = str(cna.key())
                    CNA_post = dbref.child('CNA').child(loc).child('Notifications')
                    CNA_post.update({
                        notID:{
                        'Viewed': 'False'}
                    })
                #send notifications to CNO/Director also
                all_AC = dbref.child("uAccount").get() # get all uAccount IDs
                for account in all_AC.each():
                    ac_loc = str(account.key())
                    AC_post = dbref.child('uAccount').child(ac_loc).child('Notifications')
                    AC_post.update({
                        notID:{
                        'Viewed': 'False'}
                    })
                #increment the fell time by 1
                ftime = ftime + 1
                print("Fell dectected.")
            
            #send step count to Firebase
            fb.put("/Activities/"+ _patient_ID +"/"+ dt +"/AI"+"/Step", "Step/", x)
            
            #send location to Firebase
            fb.put("/Activities/"+ _patient_ID +"/"+ dt +"/AI/" +"Location/"+ _room_num, onlyh + "/", onlym)
            
            #print to the screen
            print("Patient ID:" + _patient_ID + "," + '\n'+"Time and Step Count:" + x + '\n' + "Room" + _room_num + "," + y + '\n')
            time.sleep(10)

        #if the time is 00:00 goodmoring will be printed to the screen
        if ltm == "00:00":
            newday = "goodmorning$"
            s.write(newday.encode()) 
            print(newday)

    
#creating threads that process the function infiniteloop1
thread1 = threading.Thread(target=infiniteloop1)
thread1.start()



