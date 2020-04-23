#*****************************************************************#
# Author: HW/DB team                                              #
# Major: Information Technology                                   #
# Creation Date: Spring 2020                                      #
# Due Date: N/A                                                   #
# Course: CSC355                                                  #
# Professor Name: Dr. Tan                                         #
# Assignment: LTC-TMS                                             #
# Filename: Display.py                                            #
# Language: Python 3                                              #
# Purpose:  Displaying welcome page and activate livestream when  #
#           emergency button pressed, and stop when another hit   #
#                                                                 #
# To run my program you must know the file location and then cd   #
# to that location using putty on the acad server.                #
#*****************************************************************#

#Credit: https://dev.to/ranewallin/getting-started-with-the-waveshare-2-7-epaper-hat-on-raspberry-pi-41m8
#        https://diyprojects.io/test-waveshare-epaper-eink-2-7-spi-screen-raspberry-pi-python/

import os
import subprocess
from firebase import firebase
import subprocess
import signal
import sys    
import epd2in7
import eink
from PIL import Image,ImageDraw,ImageFont
import time
import RPi.GPIO as GPIO

#set the GPIO mode for button purpose
GPIO.setmode(GPIO.BCM)

# set a global variable for checking if the livestream is on or not
turnon = False
HR_measure = False

epd = epd2in7.EPD()
epd.init()
#epd = eink()

#browser firebase instance
url = "https://csc354-a604d.firebaseio.com/"
fb = firebase.FirebaseApplication(url, None)

key1 = 5
key2 = 6
key3 = 13
key4 = 19

GPIO.setup(key1, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(key2, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(key3, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(key4, GPIO.IN, pull_up_down=GPIO.PUD_UP)

#A function to print associated information or instruction to the display
def printToDisplay(string,_left,_top,_fontsize,stype=""):
    
    # Drawing on the Horizontal image. We must create an image object for both the black layer
    # and the red layer, even if we are only printing to one layer
    HBlackImage = Image.new('1', (epd2in7.EPD_HEIGHT, epd2in7.EPD_WIDTH), 255)  # 298*126
    HRedImage = Image.new('1', (epd2in7.EPD_HEIGHT, epd2in7.EPD_WIDTH), 255)  # 298*126

    # create a draw object and the font object we will use for the display
    draw = ImageDraw.Draw(HBlackImage)
    font = ImageFont.truetype('/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf', _fontsize)
    font15 = ImageFont.truetype('/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf', 15)
    font20 = ImageFont.truetype('/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf', 20)
    font28 = ImageFont.truetype('/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf', 28)
    # draw the text to the display. First argument is starting location of the text in pixels
    draw.text((_left, _top), string, font = font, fill = 0)
    #based on the status, display corrsponding info
    if stype == "":
        draw.text((0, 0),"<<Emergency Button(Key1)", font = font20, fill = 0)
        draw.text((0, 50),"<<Taking HeartRate(Key2)", font = font20, fill = 0)
    if stype == "HR":
        draw.text((0, 0),"<<Done", font = font15, fill = 0)
    if stype == "cam":
        draw.text((0, 150),"<<End Livestream(Key4)", font = font20, fill = 0)
    if stype == "caming":
        draw.text((20, 40),"Livestream", font = font28, fill = 0)
        draw.text((0, 150),"<<End Livestream(Key4)", font = font20, fill = 0)
    # Add the images to the display. Both the black and red layers need to be passed in, even
    # if we did not add anything to one of them
    epd.display(epd.getbuffer(HBlackImage))#, epd.getbuffer(HRedImage))


#Manipulate the display and buttons for required functionality, such as displaying heartrate and livestream
def main():
    printToDisplay("LTC-TMS v3.0",20,95,38)
    #Setting three buttons for handling associated programs when pressed
    try:   
        liveS = ""
        heartRate = ""
        while True:
            key1state = GPIO.input(key1)
            key2state = GPIO.input(key2)
            key4state = GPIO.input(key4)
            global turnon 
            global HR_measure
            #if-else conditions for handling button activities
            if (key1state == False and turnon == True and HR_measure == False):
                printToDisplay("started already!",20,65,28,"caming")
                
            if (key1state == False and turnon == False and HR_measure == False):
                #Started the livestream, and update the Status of Livestream to "on" in Firebase
                try:
                    liveS = subprocess.Popen("python3.7 ~/rpi_camera_surveillance_system.py",shell=True,preexec_fn=os.setsid)
                    turnon = True
                    fb.put("/Livestream","Status/", "on")
                    printToDisplay("Livestream started",20,55,28,"cam")
                except Exception as e:
                    printToDisplay("Livestream failed:"+ str(e),20,55,28)
            
            if (key1state == False and HR_measure == True):
                #Close the heartRate subprocess, and set HR_measure to False
                try:
                    os.killpg(heartRate.pid,signal.SIGTERM)
                    HR_measure = False
                    printToDisplay("Program closed.",20,55,28,"no")
                    printToDisplay("LTC-TMS v3.0",20,95,38)   
                except Exception as e:
                    printToDisplay("Closing failed: "+ str(e),20,55,25)
            
            if (key2state == False and HR_measure == False):
                try:
                    #start HeartRate measuring program as subprocess to measure the patient's heartrate, 
                    #while displaying the info on screen, and set HR_measure to True
                    printToDisplay("Enter ID & Start.",20,65,25,"HR")
                    heartRate = subprocess.Popen("python3.7 ~/Heartrate.py",shell=True,preexec_fn=os.setsid)
                    HR_measure = True
                except Exception as e:
                    printToDisplay("Program failed:"+ str(e),20,55,28)
            
            if (key4state == False and turnon == True):
                #Close the livestream, and update the Status of Livestream to "off" in Firebase
                try:
                    os.killpg(liveS.pid,signal.SIGTERM)
                    turnon = False
                    fb.put("/Livestream","Status/", "off")
                    printToDisplay("Livestream closed",20,55,28,"no")
                    time.sleep(0.2)
                    printToDisplay("LTC-TMS v3.0",20,95,38)     
                except Exception as e:
                    printToDisplay("Closing failed: "+ str(e),20,55,25)
    finally:
        if (type(liveS) == subprocess.Popen):
            os.killpg(liveS.pid,signal.SIGTERM)
            fb.put("/Livestream","Status/", "off") #update the status of livestream to be "off" if the program ended unexpectedly
        if (type(heartRate) == subprocess.Popen):
            os.killpg(heartRate.pid,signal.SIGTERM)
        printToDisplay("Bye!",20,65,38,"no")     

if __name__ == '__main__':
    main()

