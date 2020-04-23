$( document ).ready(function() {
  var count = 0;
  var emergencyTable = document.getElementById("emergencyTable");
  var rootRef = firebase.database().ref();
  var notificationsRef = rootRef.child("Notifications/");
  notificationsRef.once('value', function(notificationSnap) {
    notificationSnap.forEach(function(notRef) {
      //append rows to table here
      count+=1;
      var row = emergencyTable.insertRow(count);
      row.setAttribute("class","table-list-row");
      var cellDate = row.insertCell(0)
      var cellPatientID = row.insertCell(1);
      var cellStatus= row.insertCell(2);
      notRef.forEach(function(notificationFields) {
        // if 'whatever' append to matching 'td' statements
        if (notificationFields.key=="Datetime") {
          cellDate.appendChild(document.createTextNode(notificationFields.val()));
        } else if (notificationFields.key=="Patient ID") {
          cellPatientID.appendChild(document.createTextNode(notificationFields.val()));
        } else if (notificationFields.key=="Status") {
          cellStatus.appendChild(document.createTextNode(notificationFields.val()));
        }
      });
      // have to change status to viewed for specific account
    });
  });
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // use the UID to loop through UID node in DB, get the DB version of the UID
      var uID = firebase.auth().currentUser.uid;
      var rootRef = firebase.database().ref();
      var uidRef = rootRef.child("UID/");
      uidRef.once('value', function(uidSnap) {
        uidSnap.forEach(function(uidChild) {
          if  (uidChild.key==uID) {
            // console.log("uID: " + uID + "==" + "uidChild.key: " + uidChild.key);
            var realUID = uidChild.val();
            // Now, use realUID to loop through uAccounts to find a match
            var uAccountRef = rootRef.child("uAccount/");
            uAccountRef.once('value', function(uAccountSnap) {
              // Loop again through uAccount->Notifications for the matching account
              uAccountSnap.forEach(function(uAccountChild) {
                if (uAccountChild.key==realUID) {
                  console.log("uAccountChild.key: " + uAccountChild.key + "==" + "realUID: " + realUID);
                  uAccountChild.forEach(function(notificationChild) {
                    if (notificationChild.key=="Notifications") {
                      notificationChild.forEach(function(notificationSnap) {
                        var notificationID = notificationSnap.key;
                        console.log("notificationID");
                        console.log(notificationID);
                        notificationSnap.forEach(function(viewedStatus) {
                          if (viewedStatus.key=="Viewed" && viewedStatus.val()=="False") {
                            var userSpecificNotesRef = firebase.database().ref("uAccount/"+realUID+"/Notifications/"+notificationID+"/");
                            userSpecificNotesRef.update({Viewed: "True"});
                          }
                        });
                      });
                    }
                  });
                }
              });
            });
          }
        })
      });
    } else {
      console.log("Not logged in");
    }
  });
});
