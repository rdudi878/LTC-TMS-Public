#*****************************************************************#
# Author: MCU and KU Students                                     #
# Major: Information Technology                                   #
# Creation Date: Spring 2020                                      #
# Due Date: N/A                                                   #
# Course: CSC355                                                  #
# Professor Name: Dr. Tan                                         #
# Assignment: LTC-TMS                                             #
# Filename: HeartRate.py                                          #
# Language: Python 3                                              #
# Purpose:  Creating a program that will talk with the database   #
#           and Microbits, and display real-time reading on screen#
#                                                                 #
# To run my program you must know the file location and then cd   #
# to that location using putty on the acad server.                #
# Then you will enter "python H.py".                              #
#*****************************************************************#

#*******************************************************************#
# MIT License                                                       #
#                                                                   #
# Copyright (c) 2016 Udayan Kumar                                   #
#                                                                   #
# Permission is hereby granted, free of charge, to any person       #
# obtaining a copy of this software and associated documentation    #
# files (the "Software"), to deal in the Software without           #
# restriction, including without limitation the rights to use,      #
# copy, modify, merge, publish, distribute, sublicense, and/or sell #
# copies of the Software, and to permit persons to whom the         #
# Software is furnished to do so, subject to the following          #
# conditions:                                                       #
#*******************************************************************#

import threading
import sys
import Adafruit_DHT
import datetime
from firebase import firebase
import serial, time
import time
import Adafruit_ADS1x15
import epd2in7
from PIL import Image,ImageDraw,ImageFont
import os
import pyrebase
import traceback


#**********************************************************************#
#                                                                      #  
# Function Name: infiniteloop2                                         #
# Description: This function listens for data from the heart rate      #
#              sensor, and pushes the data to Firebase for storage.    #
# Parameters:  N/A - It takes in data via serial port, not parameters  #
# Return Value: N/A - There is nothing to return for another function, #
#               it pushes the data straight to Firebase                #
#                                                                      #
#**********************************************************************#

def infiniteloop2():
    
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
    
    #initiate and clear the display, set associated variables
    epd = epd2in7.EPD()
    epd.init()
    image = Image.new('1', (epd2in7.EPD_WIDTH, epd2in7.EPD_HEIGHT), 255)    # 255: clear the image with white
    #epd.Clear(0xFF)
    font15 = ImageFont.truetype('/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf', 15)
    font25 = ImageFont.truetype('/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf', 25)
    font30 = ImageFont.truetype('/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf', 30)
    # Drawing on the Horizontal image. We must create an image object for both the black layer
    # and the red layer, even if we are only printing to one layer
    HBlackImage = Image.new('1', (epd2in7.EPD_HEIGHT, epd2in7.EPD_WIDTH), 255)  # 298*126
    HRedImage = Image.new('1', (epd2in7.EPD_HEIGHT, epd2in7.EPD_WIDTH), 255)  # 298*126
    
    #browser firebase instance
    url = "https://csc354-a604d.firebaseio.com/"
    fb = firebase.FirebaseApplication(url, None)
    
    _patient_ID = input("enter patient ID: ")
    
    #create a draw object and the font object we will use for the display, and display an description.
    draw = ImageDraw.Draw(HBlackImage)
    draw.text((0, 0),"<<Done", font = font15, fill = 0)
    draw.text((20, 55), 'Heartrate Readings...', font = font25, fill = 0)
    epd.display(epd.getbuffer(HBlackImage))#, epd.getbuffer(HRedImage))
    
    adc = Adafruit_ADS1x15.ADS1015()
    
    # initialization 
    GAIN = 2/3  
    curState = 0
    thresh = 525  # mid point in the waveform
    P = 512
    T = 512
    stateChanged = 0
    sampleCounter = 0
    lastBeatTime = 0
    firstBeat = True
    secondBeat = False
    Pulse = False
    IBI = 600
    rate = [0]*10
    amp = 100 

    lastTime = int(time.time()*1000)
    
    # Main loop. use Ctrl-c to stop the code
    while True:
    
        # read from the ADC
        Signal = adc.read_adc(0, gain=GAIN)   #TODO: Select the correct ADC channel. I have selected A0 here
        curTime = int(time.time()*1000)
        
        tms = str(time.strftime("%H~%M~%S"))#hours, minutes, seconds
        dt = str(time.strftime("%Y-%m-%d"))#Year, month, day

        sampleCounter += (curTime - lastTime);     # keep track of the time in mS with this variable
        lastTime = curTime
        N = sampleCounter - lastBeatTime;        # monitor the time since the last beat to avoid nois

        #  find the peak and trough of the pulse wave
        if Signal < thresh and N > (IBI/5.0)*3.0 :  # avoid dichrotic noise by waiting 3/5 of last IBI
            if Signal < T :                         # T is the trough
              T = Signal;                           # keep track of lowest point in pulse wave 

        if Signal > thresh and  Signal > P:         # thresh condition helps avoid noise
            P = Signal;                             # P is the peak
                                                    # keep track of highest point in pulse wave

        #  NOW IT'S TIME TO LOOK FOR THE HEART BEAT
        # signal surges up in value every time there is a pulse
        if N > 250 :                                      # avoid high frequency noise
            if  (Signal > thresh) and  (Pulse == False) and  (N > (IBI/5.0)*3.0):       
                Pulse = True;                               # set the Pulse flag when we think there is a pulse
                IBI = sampleCounter - lastBeatTime;         # measure time between beats in mS
                lastBeatTime = sampleCounter;               # keep track of time for next pulse

                if secondBeat :                        # if this is the second beat, if secondBeat == TRUE
                    secondBeat = False;                  # clear secondBeat flag
                    for i in range(0,10):             # seed the running total to get a realisitic BPM at startup
                        rate[i] = IBI;                      

                if firstBeat :                        # if it's the first time we found a beat, if firstBeat == TRUE
                    firstBeat = False;                   # clear firstBeat flag
                    secondBeat = True;                   # set the second beat flag
                    continue                              # IBI value is unreliable so discard it

                # keep a running total of the last 10 IBI values
                runningTotal = 0;                  # clear the runningTotal variable    

                for i in range(0,9):                # shift data in the rate array
                    rate[i] = rate[i+1];                  # and drop the oldest IBI value 
                    #runningTotal += rate[i];              # add up the 9 oldest IBI values

                rate[9] = IBI;                          # add the latest IBI to the rate array
                #runningTotal += rate[9];                # add the latest IBI to runningTotal
                runningTotal = sum(rate)
                runningTotal /= 10;                     # average the last 10 IBI values 
                BPM = 60000/runningTotal;               # how many beats can fit into a minute? that's BPM!
              
			    #round the BPM to 2 decimal point for display on screen
                Round_BPM = str(round(BPM,2))
                #create a draw object and the font object we will use for the heartrate display.
                Limage = Image.new('1',(epd2in7.EPD_HEIGHT, epd2in7.EPD_WIDTH), 255) # 255: clear the frame
                draw = ImageDraw.Draw(Limage)
                draw.text((0, 0),"<<Done", font = font15, fill = 0)
              
                #send latest heart rate to Firebase
                fb.put("/Activities"+"/"+ str(_patient_ID) +"/"+ dt +"/AI" +"/HeartRate","LastestHeartRate/", (tms + "?" + "→" + "?"+ str(BPM)))
                #send heart rate to list of HR in Firebase
                fb.put("/Activities"+"/"+ str(_patient_ID) +"/"+ dt +"/AI"+"/HeartRateRecord",tms + "/",  BPM)
                
                #differentiate the BPM values and perform corresponding actions
                if (BPM>100): 
                    post_ref = dbref.child('Notifications')      #setup a post variable for sending data to specific branch in DB
                    htime = str(datetime.datetime.now())
                    #send notifications to database as high heart rate, and put a caution on display
                    post_key_ref = post_ref.push({
                        'Patient ID': _patient_ID,
                        'Datetime': htime,
                        'Status': 'High heart rate: ' + str(BPM) + " BPM"
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
                    draw.text((25, 55), Round_BPM + " BPM", font = font30, fill = 0)
                    draw.text((25, 90), "BPM is too high!", font = font30, fill = 0)
                    epd.display(epd.getbuffer(Limage))#, epd.getbuffer(HRedImage)
                else:
                    draw.text((25, 55), Round_BPM + " BPM", font = font30, fill = 0)
                    epd.display(epd.getbuffer(Limage))#, epd.getbuffer(HRedImage)
                
                print ('BPM: {}'.format(BPM)) #print on console
              
              
        if Signal < thresh and Pulse == True :   # when the values are going down, the beat is over
            Pulse = False;                         # reset the Pulse flag so we can do it again
            amp = P - T;                           # get amplitude of the pulse wave
            thresh = amp/2 + T;                    # set thresh at 50% of the amplitude
            P = thresh;                            # reset these for next time
            T = thresh;

        if N > 2500 :                          # if 2.5 seconds go by without a beat
            thresh = 512;                          # set thresh default
            P = 512;                               # set P default
            T = 512;                               # set T default
            lastBeatTime = sampleCounter;          # bring the lastBeatTime up to date        
            firstBeat = True;                      # set these to avoid noise
            secondBeat = False;                    # when we get the heartbeat back
            print ("no beats found")
            

        time.sleep(0.0005)
        
    
    
    
#creating thread that process the function infiniteloop2

thread2 = threading.Thread(target=infiniteloop2)
thread2.start()

