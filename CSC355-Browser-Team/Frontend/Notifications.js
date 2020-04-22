function displayNotifications() {
  var rootRef = firebase.database().ref();
  var notificationRef = rootRef.child("Notifications/");
  notificationRef.once('value', function(notificationSnap){
    notificationSnap.forEach(function(notificationChild) {
// Pulling out the Notification key so that it can be dynamically referenced for getting daily statuses
      notificationKey = notificationChild.key;
      console.log("notificationKey:");
      console.log(notificationChild.key);
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
  console.log("notifications script is running");
}
