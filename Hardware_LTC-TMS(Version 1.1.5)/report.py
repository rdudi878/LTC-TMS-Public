
'''
    Author:     Max,Yau and HW/DB Team
    Version:    LTC-TMS 3.0 Sprint 2 Release
    Purpose:    Gather heart rate and step count data from Firebase and generate text and bar graphs
	Website:    https://csc354-a604d.web.app/Frontend/Reports.html
                username: directortest@gmail.com
                password: directortest123123
    Use:        "crontab -e" -- each process will run 5mins
                "* * * * * /usr/local/bin/python3.7 /home/STUDENTS/ylam887/reports.py &" --one process per min
                /"00,05,10,15,20,25,30,35,40,45,50,55 * * * * /usr/local/bin/python3.7 /home/STUDENTS/ylam887/reports.py &" -- one process per 5 mins
    Notes:      access reports at http://acad.kutztown.edu/ltctms/<reportname>
                all paths and directories muts be modified to run under a different user or system environment
                the code can be easily modified to run in a Windows environment or any other system
                it is currently setup for the Unix server at Kutztown
'''

import calendar
import datetime
import os
import statistics
import subprocess
import time
import threading
import sys
from datetime import date, timedelta
from email import message

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pyrebase # SOURCE: https://github.com/thisbejim/Pyrebase
from matplotlib.backends.backend_pdf import PdfPages
from matplotlib.cbook import get_sample_data

# found in Firebase, copy & paste
config = {
  "apiKey": "AIzaSyDTQfbN-Ag-GN1z0pI-kIRnc4LtUB83NPw",
  "authDomain": "csc354-a604d.firebaseapp.com",
  "databaseURL": "https://csc354-a604d.firebaseio.com",
  "projectId": "csc354-a604d",
  "storageBucket": "csc354-a604d.appspot.com",
  "messagingSenderId": "786974548917",
  "appId": "1:786974548917:web:504b52b9ef22062c9daffc",
  "measurementId": "G-8KLJLYJMS2"
}

# config and initialization

# listens for new report request in db
def stream_handler(message):
    global newData
    message = ('{m[path]};{m[data]};{m[event]}'
        .format(m=message))
    newData = True

firebase = pyrebase.initialize_app(config)
db = firebase.database()
my_stream = db.child("Reports").child("Time").stream(stream_handler)
newData = False

# accesses database, get heart rate and step count, creates graphs, and saves to pdf
def accessDB(patientID, start, end = date.today()):
    try:
        stepDate = list()
        stepValue = list()
        heartDate = list()
        avgHeartRate = list()
        tempDate = list()
        tempValue = list()
        bpDate = list()
        bpUpper = list()
        bpLower = list()
        heartFlag = "false"
        stepFlag = "false"
        bloodFlag = "false"
        tempFlag = "false"
        #declare a variable look for day of heartrate in report
        dayHR = list()
        patientInfo = db.child("Activities").child(patientID).get() # get all dates with that patient ID
        delta = end - start # find difference between start and end date
        patientName = str((db.child("Patient").child(patientID).child("Portfolio").child("Name").get()).val())
        reportName = patientName + '_' + str(start) + '_' + str(end) + '.pdf'
        pp = PdfPages(reportName)
        # loops over database, checks for required fields, then stores data for use in report generation
        for i in range(delta.days + 1):
            for dates in patientInfo.each():
                daysFirst = "true"
                if (str(dates.key()) == date.strftime(start + timedelta(i),'%Y-%m-%d') or str(dates.key()) == date.strftime(start + timedelta(i),'%Y-%m-%d').replace('-0','-')):
                    # for loop verifies that field exists under that date before accessing data
                    for field in db.child("Activities").child(patientID).child(str(dates.key())).child("AI").get().each():
                        if str(field.key()) == "Step":
                            # get step data
                            stepFlag = "true"
                            stepCount = (db.child("Activities").child(patientID).child(str(dates.key())).child("AI").child("Step").get()).val()
                            stepCount = stepCount['Step'].split("?")
                            stepDate.append(str(dates.key()))
                            stepValue.append(int(stepCount[2]))
                            
                        if str(field.key()) == "HeartRate":
                            dayHR.append(str(dates.key()))
                            
                        if str(field.key()) == "HeartRateRecord":
                            # get heart rate data
                            heartFlag = "true"
                            heartValue = (db.child("Activities").child(patientID).child(str(dates.key())).child("AI").child("HeartRateRecord").get()).val()
                            tempList = list()
                            for key in heartValue.keys():
                                tempList.append(heartValue[key])
                            heartDate.append(str(dates.key()))
                            avgHeartRate.append(np.mean(tempList))

                    for field in db.child("Activities").child(patientID).child(str(dates.key())).get().each():
                        if str.isdigit(field.key()):
                            for data in db.child("Activities").child(patientID).child(str(dates.key())).child(str(field.key())).child("vital_status").get().each():
                                if "BloodPressure" in str(data.key()):
                                    bpValue = db.child("Activities").child(patientID).child(str(dates.key())).child(str(field.key())).child("vital_status").child(str(data.key())).get().val().split('~')
                                    bloodFlag = "true"
                                    if (daysFirst == "true"):
                                        bpDate.append(str(dates.key()))
                                        bpUpper.append(int(bpValue[0]))
                                        bpLower.append(int(bpValue[1]))
                                if "Temperature" in str(data.key()):
                                    tempFlag = "true"
                                    if (daysFirst == "true"):
                                        tempValue.append(float(db.child("Activities").child(patientID).child(str(dates.key())).child(str(field.key())).child("vital_status").child(str(data.key())).get().val()))                                  
                                        tempDate.append(str(dates.key()))
                                daysFirst = "false"
        # Heart Rate Graph
        fig1 = plt.figure(figsize=(11.69,8.35))
        # TODO: daily report, optional implementation to show all values collected in a 24 hour period
        # instead of the usual daily average that is displayed on the graphs
        #         print(heartRate.key())
        #         print(heartRate.val())
        if (heartFlag == "true"):
            if (len(dayHR) == 1):
                #dailyHeartData = list()
                dailyHeartRate = list()
                dailyHeartTime = list()
                #for heartRate in db.child("Activities").child(patientID).child(str(start)).child("AI").child("HeartRateRecord").get().each():
                    #dailyHeartRate.append(heartRate.val())
                    #dailyHeartTime.append(heartRate.key())
                #print(patientID)
                #print(heartDate[0])
                dailyHeartData = (db.child("Activities").child(patientID).child(str(heartDate[0])).child("AI").child("HeartRateRecord").get()).val()
                tempList = list()
                firstLoop = "true"
                hourKey = ""
                print("generating heart plot")
                for key in dailyHeartData.keys():
                    if (firstLoop == "true"):
                        firstLoop = "false"
                        print(key)
                        hourKey = key[0:2]
                        #print("a")
                    if (key[0:2] == hourKey):
                        tempList.append(int(dailyHeartData[key]))
                        hourKey = key[0:2]
                        #print("b")
                    else:
                        dailyHeartRate.append(np.mean(tempList))
                        dailyHeartTime.append(hourKey)
                        tempList.clear()
                        tempList.append(int(dailyHeartData[key]))
                        hourKey = key[0:2]
                        #print("c")
                    #dailyHeartRate.append(dailyHeartData[key])
                    #dailyHeartTime.append(key)
                #dailyHeartTime = (db.child("Activities").child(patientID).child(str(start)).child("AI").child("HeartRateRecord").get()).key()
                plt.plot(dailyHeartTime, dailyHeartRate, 'o')
                plt.xlabel('Time')
            else:
                plt.bar(heartDate,avgHeartRate)
                plt.xlabel('Date')
            plt.xticks(fontsize=10, rotation=45)
            plt.ylabel('Heart Rate (BPM)', fontsize=15)
            heartTitle = patientName + " Average Heart Rate"
            plt.title(heartTitle, fontsize=25)
            #plt.ylim(60, 100)
            plt.gcf().subplots_adjust(bottom=0.15)
            pp.savefig(fig1)
            plt.close()
        
        
        # Step Graph
        if(stepFlag == "true"):
            fig2 = plt.figure(figsize=(11.69,8.35))
            plt.xlabel('Date')
            plt.xticks(fontsize=9.2, rotation=45)
            plt.ylabel('Step Count', fontsize=15)
            stepTitle = patientName + " Daily Step Count"
            plt.title(stepTitle, fontsize=25)
            if (len(stepDate) == 1):
                plt.bar(stepDate,stepValue,width=0.5,align='center')
                plt.xlim(0,2)
            else:
                plt.bar(stepDate,stepValue)
            
            plt.gcf().subplots_adjust(bottom=0.15)
            pp.savefig(fig2)
            plt.close()

        # Blood Pressure Graph
        if(bloodFlag == "true"):
            fig3 = plt.figure(figsize=(11.69,8.35))
            plt.xlabel('Date')
            plt.xticks(fontsize=9.2, rotation=45)
            plt.ylabel('Blood Pressure (mmHg)', fontsize=15)
            plt.title(patientName + " Blood Pressure", fontsize=25)
            plt.plot(bpDate,bpUpper,label='Systolic',color='red')
            plt.plot(bpDate,bpLower,label='Diastolic',color='blue')
            plt.legend(["Systolic","Diastolic"])
            plt.gcf().subplots_adjust(bottom=0.15)
            
            pp.savefig(fig3)
            plt.close()

        # Temperature Graph
        if(tempFlag == "true"):
            fig4 = plt.figure(figsize=(11.69,8.35))
            plt.xlabel('Date')
            plt.xticks(fontsize=9.2, rotation=45)
            plt.ylabel('Temperature (Celsius)', fontsize=15)
            plt.title(patientName + " Temperature", fontsize=25)
            plt.plot(tempDate,tempValue)
            plt.gcf().subplots_adjust(bottom=0.15)
            pp.savefig(fig4)
            plt.close()
        
        # Pie chart for step count only if there are more than one step count data, ie. weekly/monthly reports
        if (len(stepValue) > 1):
            #categorize data into groups as '<30 Steps', '31-60 Steps'... so on to'>180 Steps'
            temp = list()
            stepGroup = list()
            for i in stepValue:
                if (i<30):
                    x = '<30 Steps'
                    if x in temp:
                        stepGroup[temp.index(x)]+=1
                    else:
                        temp.append(x)
                        stepGroup.append(1)
                elif (i>30 and i<61):
                    x = '31-60 Steps'
                    if x in temp:
                        stepGroup[temp.index(x)]+=1
                    else:
                        temp.append(x)
                        stepGroup.append(1)
                elif (i>60 and i<91):
                    x = '61-90 Steps'
                    if x in temp:
                        stepGroup[temp.index(x)]+=1
                    else:
                        temp.append(x)
                        stepGroup.append(1)
                elif (i>90 and i<121):
                    x = '91-120 Steps'
                    if x in temp:
                        stepGroup[temp.index(x)]+=1
                    else:
                        temp.append(x)
                        stepGroup.append(1)
                elif (i>120 and i<151):
                    x = '121-150 Steps'
                    if x in temp:
                        stepGroup[temp.index(x)]+=1
                    else:
                        temp.append(x)
                        stepGroup.append(1)
                elif (i>150 and i<181):
                    x = '151-180 Steps'
                    if x in temp:
                        stepGroup[temp.index(x)]+=1
                    else:
                        temp.append(x)
                        stepGroup.append(1)
                elif (i>180):
                    x = '>180 Steps'
                    if x in temp:
                        stepGroup[temp.index(x)]+=1
                    else:
                        temp.append(x)
                        stepGroup.append(1)
            labels=tuple(temp)
            elist = [0]*(len(temp))
            elist[stepGroup.index(max(stepGroup))] = 0.1
            #explode maximum slice				
            explode = tuple(elist)
            fig5, ax1 = plt.subplots(figsize=(11.60,8.25))
            ax1.pie(stepGroup, explode=explode, labels=labels, autopct='%1.1f%%', shadow=True, startangle=90, textprops={'fontsize':18})
            ax1.set_title("Step Count's Distribution", fontsize=25)
            #equal aspect ratio so the pie is a circle
            ax1.axis('equal') 
            pp.savefig(fig5)
            plt.close()

        

        # Text report
        heartCoord = .79
        stepCoord = .79
        tempCoord = .79
        bpCoord = .79
        i = 0
        j = 0
        k = 0
        m = 0
        firstPage = plt.figure(figsize=(11.69,8.35))
        firstPage.clf()
        textTitle = patientName + " (" +  patientID + ") Text Report"
        titleDates = str(start) + " to " + str(end)
        textHeartRate = "Avg Heart Rate: " + str(round(np.mean(avgHeartRate))) + " (BPM)"
        textStepCount = "Avg Step Count: " + str(round(np.mean(stepValue))) + " (Steps)"
        textTempAvg = "Avg Temperature: " + str(round(np.mean(tempValue))) + " (Celsius)"
        textBpAvg = "Avg Blood Pressure: " + str(round(np.mean(bpUpper))) + '/' + str(round(np.mean(bpLower))) + " (mmHg)"
        firstPage.text(0.475,0.9,textTitle, transform=firstPage.transFigure, size=24, ha="center")
        firstPage.text(0.475,0.85,titleDates, transform=firstPage.transFigure, size=14, ha="center")
        firstPage.text(0.05,0.8,textHeartRate, transform=firstPage.transFigure, size=10, ha="left")
        firstPage.text(0.25,0.8,textStepCount, transform=firstPage.transFigure, size=10, ha="left")
        firstPage.text(0.465,0.8,textTempAvg, transform=firstPage.transFigure, size=10, ha="left")
        firstPage.text(0.675,0.8,textBpAvg, transform=firstPage.transFigure, size=10, ha="left")

        for dates in heartDate:
            heartCoord -= .02
            heartText = str(dates) + ": " + str(round(avgHeartRate[j]))
            firstPage.text(0.05,heartCoord,heartText, transform=firstPage.transFigure, size=11, ha="left")
            j = j + 1
        for dates in stepDate:
            stepCoord -= .02
            stepText = str(dates) + ": " + str(stepValue[i])
            firstPage.text(0.25,stepCoord,stepText, transform=firstPage.transFigure, size=11, ha="left")
            i = i + 1
        for dates in tempDate:
            tempCoord -= .02
            tempText = str(dates) + ": " + str(tempValue[k])
            firstPage.text(0.465,tempCoord,tempText, transform=firstPage.transFigure, size=11, ha="left")
            k = k + 1
        for dates in bpDate:
            bpCoord -= .02
            bpText = str(dates) + ": " + str(bpUpper[m]) + '/' + str(bpLower[m])
            firstPage.text(0.675,bpCoord,bpText, transform=firstPage.transFigure, size=11, ha="left")
            m = m + 1
        # replace my username with appropriate destination and directory
        im = plt.imread(get_sample_data('/www/ltctms/logoExport.png'))
        newax1 = firstPage.add_axes([0.725, 0.8, 0.2, 0.2], anchor='NE', zorder=-1)
        newax1.imshow(im)
        newax1.axis('off')
        newax2 = firstPage.add_axes([0.01, 0.8, 0.2, 0.2], anchor='NW', zorder=-1)
        newax2.imshow(im)
        newax2.axis('off')
        pp.savefig(firstPage)
        plt.close()
        pp.close()

        # copy report to kutztown web then delete from local directory to clean up
        # replace my username with another to function
        subprocess.Popen(["scp", reportName, "/www/ltctms"]).communicate(timeout=1) # copy report to acad web area
        #os.remove(os.getcwd() + '/' + reportName)
        db.child("Reports").update({"Success": "true"})
        print("report successfully generated")
        return
    # catches all exceptions and kills thread if there are any, should be improved on in the future
    except Exception as e:
        print("report failed: "+ str(e))
        return

# loop to generate reports
while True:
    if (newData == True):
        newData = False
        IDvalue = str(db.child("Reports").child("IDvalue").get().val())
        StartDate = db.child("Reports").child("StartDate").get().val().split('-')
        EndDate = db.child("Reports").child("EndDate").get().val().split('-')
        print("Generating report for " + IDvalue, " from ",StartDate, " to ", EndDate)
        t = threading.Thread(target=accessDB, args=(IDvalue,date(int(StartDate[0]),int(StartDate[1]),int(StartDate[2])),
        date(int(EndDate[0]),int(EndDate[1]),int(EndDate[2]))))
        t.isDaemon()
        t.start()

exit(0)


