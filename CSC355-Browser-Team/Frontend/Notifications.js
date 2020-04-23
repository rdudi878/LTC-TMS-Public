function displayNotifications() {
  var rootRef = firebase.database().ref();
  var notificationRef = rootRef.child("Notifications/");
  notificationRef.once('value', function(notificationSnap){
    notificationSnap.forEach(function(notificationChild) {
// Pulling out the Notification key so that it can be dynamically referenced for getting daily statuses
      notificationKey = notificationChild.key;
      // console.log("notificationKey:");
      // console.log(notificationChild.key);
      var patientID = notificationSnap.child(notificationKey+"/Patient ID");
      var status = notificationSnap.child(notificationKey+"/Status");
      if (notificationSnap.child(notificationKey+"/Datetime").exists()) {
        var time = notificationSnap.child(notificationKey+"/Datetime");
        var legibleTime = time.val();
        var date = legibleTime.split('_')[0];
        var time = legibleTime.split('_')[1];
        // time = time.replace(/~/g, ":")
        // legibleTime = time.replace(/~/g, ":");
      }
      $("div#notificationDropdown").append('<a>' + "Patient "+patientID.val()+" fell on "+date +" at "+legibleTime+ '</a>');
    });
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var count = 0;
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
                        notificationSnap.forEach(function(littleGuys) {
                          if (littleGuys.key=="Viewed" && littleGuys.val()=="False") {
                            // Increment the emergency notification count
                            count +=1;
                            // console.log(count);
                          }
                        });
                      });
                    }
                  });
                }
              });
              // Append the count to the red circle
              var emergencyNum = document.getElementById("emergencyNum");
              // console.log("count");
              // console.log(count);
              if (count==0) {
                emergencyNum.style="display:none;"
              } else {
                emergencyNum.innerHTML = count;
              }
            });
          }
        })
      });
    } else {
      console.log("Not logged in");
    }
  });
}
