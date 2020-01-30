'''
    Author:     Nolan Perugini and HW/DB/NW Team
    Version:    LTC-TMS 1.1.5 Sprint 4 Release
    Purpose:    Gather heart rate and step count data from Firebase and generate text and bar graphs
	Website:    https://browserteam.firebaseapp.com/Frontend/Reports.html
                https://csc354-firebase-instance.firebaseapp.com/Frontend/Reports.html
                username: director@test.com
                password: ku2019
    Use:        "ssh nperu898@csit.kutztown.edu"
                "ssh 552"
                "nohup python3.7 reports/report.py &"
    Notes:      access reports at http://acad.kutztown.edu/~nperu898/<reportname>
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
   "messagingSenderId": "786974548917"
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
        patientInfo = db.child("Activities").child(patientID).get() # get all dates with that patient ID
        delta = end - start # find difference between start and end date
        patientName = str((db.child("Patient").child(patientID).child("Portfolio").child("Name").get()).val())
        reportName = patientName + '_' + str(start) + '_' + str(end) + '.pdf'
        pp = PdfPages(reportName)
        # loops over database, checks for required fields, then stores data for use in report generation
        for i in range(delta.days + 1):
            for dates in patientInfo.each():
                if str(dates.key()) == date.strftime(start + timedelta(i),'%Y-%m-%d').replace('-0','-'):
                    # for loop verifies that field exists under that date before accessing data
                    for field in db.child("Activities").child(patientID).child(str(dates.key())).child("AI").get().each():
                        if str(field.key()) == "Step":
                            # get step data
                            stepCount = (db.child("Activities").child(patientID).child(str(dates.key())).child("AI").child("Step").get()).val()
                            stepCount = stepCount['Step'].split("?")
                            stepDate.append(str(dates.key()))
                            stepValue.append(int(stepCount[2]))

                        if str(field.key()) == "HeartRateRecord":
                            # get heart rate data
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
                                    bpDate.append(str(dates.key()))
                                    bpUpper.append(int(bpValue[0]))
                                    bpLower.append(int(bpValue[1]))
                                if "Temperature" in str(data.key()):
                                    tempValue.append(float(db.child("Activities").child(patientID).child(str(dates.key())).child(str(field.key())).child("vital_status").child(str(data.key())).get().val()))
                                    tempDate.append(str(dates.key()))
        # Heart Rate Graph
        fig1 = plt.figure(figsize=(11.69,8.27))
        # TODO: daily report, optional implementation to show all values collected in a 24 hour period
        # instead of the usual daily average that is displayed on the graphs
        # if (delta.days == 0):
        #     heartRate = list()
        #     for heartRate in db.child("Activities").child(patientID).child(str(start)).child("AI").child("HeartRateRecord").get():
        #         print(heartRate)
        #         print(heartRate.key())
        #         print(heartRate.val())
        plt.bar(heartDate,avgHeartRate)
        plt.xlabel('Date')
        plt.xticks(fontsize=10, rotation=45)
        plt.ylabel('Heart Rate (BPM)', fontsize=15)
        heartTitle = patientName + " Average Heart Rate"
        plt.title(heartTitle, fontsize=25)
        plt.ylim(60, 100)
        pp.savefig(fig1)
        plt.close()

        # Step Graph
        fig2 = plt.figure(figsize=(11.69,8.27))
        plt.xlabel('Date')
        plt.xticks(fontsize=10, rotation=45)
        plt.ylabel('Step Count', fontsize=15)
        stepTitle = patientName + " Daily Step Count"
        plt.title(stepTitle, fontsize=25)
        plt.bar(stepDate,stepValue)
        pp.savefig(fig2)
        plt.close()

        # Blood Pressure Graph
        fig3 = plt.figure(figsize=(11.69,8.27))
        plt.xlabel('Date')
        plt.xticks(fontsize=10, rotation=45)
        plt.ylabel('Blood Pressure (mmHg)', fontsize=15)
        plt.title(patientName + " Blood Pressure", fontsize=25)
        plt.plot(bpDate,bpUpper,label='Systolic',color='red')
        plt.plot(bpDate,bpLower,label='Diastolic',color='blue')
        plt.legend(["Systolic","Diastolic"])
        pp.savefig(fig3)
        plt.close()

        # Temperature Graph
        fig4 = plt.figure(figsize=(11.69,8.27))
        plt.xlabel('Date')
        plt.xticks(fontsize=10, rotation=45)
        plt.ylabel('Temperature (Celsius)', fontsize=15)
        plt.title(patientName + " Temperature", fontsize=25)
        plt.plot(tempDate,tempValue)
        pp.savefig(fig4)
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
        firstPage = plt.figure(figsize=(11.69,8.27))
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
        im = plt.imread(get_sample_data('/home/STUDENTS/nperu898/reports/logo.png'))
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
        subprocess.Popen(["scp", reportName, "nperu898@csit.kutztown.edu:/www/student/nperu898"]).communicate(timeout=1) # copy report to acad web area
        os.remove(os.getcwd() + '/' + reportName)
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
