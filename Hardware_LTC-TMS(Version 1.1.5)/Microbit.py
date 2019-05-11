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
    while True: 
    
        #create a variable called port that will contain the port we are connecting to used to connect our computer to the micro:bit
        port = "/dev/ttyACM0"
        #store the connection
        baud = 115200
        #to configure our serial port and the speed of connection
        s = serial.Serial(port)
        s.baudrate = baud

        #our firebase url
        url = "https://share-b7589.firebaseio.com/"
        fb = firebase.FirebaseApplication(url, None)

        #6 variables for time
        tm = str(time.strftime("%H~%M"))
        ltm = str(time.strftime("%H:%M"))# hours, Minutes
        tms = str(time.strftime("%H~%M~%S"))#hours, minutes, seconds
        dt = str(time.strftime("%Y-%-m-%-d"))#Year, month, day
        onlyh = str(time.strftime("%H"))#hours
        onlym = str(time.strftime("%M"))#minutes

        #read the lines of data being sent via the serial connection and saving it as variable data
        data = s.readline()

        #print(data)#b'205,550001,32,0

        data = str(data[0:24])# convert data to a string
        sptdata = data.split(',')# splits the data with a comma

        #print("Data:" + data) #Data:b'205,550001,32,0 
  
        #assign room number to variable 
        sptdata[0] = "Location"
        locationdata = "205"
        
        #assign patient id to variable
        sptdata[1] = "550001"
        patientiddata = sptdata[1]

        #step count is at index 2    
        stepdata = sptdata[2]

        #fall detection is at index 3
        falldata = sptdata[3]    #KU changed
    
    
       #variables for different time formats?
        x = tm + "?" + "→"+ "?" + stepdata + "?" + "steps"
        y = "Time:" + tm
        f = tms + "?" + "→" + "?"+ falldata  
        
        #send step count to Firebase
        fb.put("/Activities"+"/"+sptdata[1]+"/"+ dt +"/AI"+"/Step", "Step/", x)
        
        #send location to Firebase
        fb.put("/Activities"+"/"+sptdata[1]+"/"+ dt +"/AI" +"/"+sptdata[0]+"/"+locationdata, onlyh + "/", onlym)
        
        #send fall detection value to Firebase
        fb.put("/Activities"+"/"+sptdata[1]+"/"+ dt +"/AI" +"/FallRecord", "Fell/", f)  #KU changed
        
        #print to the screen
        print("Patient ID:" +patientiddata + "," + '\n'+"Time and Step Count:" + x + '\n' + "Room" + locationdata + "," + y + '\n')
        time.sleep(10)

        #if the time is 00:00 goodmoring will be printed to the screen
        if ltm == "00:00":
            newday = "goodmorning$"
            s.write(newday.encode()) 
            print(newday)

    
#creating threads that process the function infiniteloop1
thread1 = threading.Thread(target=infiniteloop1)
thread1.start()


