function displayNotifications() {
  var rootRef = firebase.database().ref();
  var notificationRef = rootRef.child("Notifications/");
  notificationRef.once('value', function(notificationSnap){
    notificationSnap.forEach(function(notificationChild) {
// Pulling out the Notification key so that it can be dynamically referenced for getting daily statuses
      notificationKey = notificationChild.key;
      var patientID = notificationSnap.child(notificationKey+"/PatientID");
      var status = notificationSnap.child(notificationKey+"/Status");
      var time = notificationSnap.child(notificationKey+"/Datetime");
      var legibleTime = time.val();
      var date = legibleTime.split('_')[0];
      var time = legibleTime.split('_')[1];
      legibleTime = time.replace(/~/g, ":")

      $("div#notificationDropdown").append('<a>' + "Patient "+patientID.val()+" fell on "+date +" at "+legibleTime+ '</a>');

      // var startListening = function() {
        // rootRef.on('value', function(snapshot) {
        //   console.log("notificationKey:");
        //   console.log(notificationKey);
          // var notification = snapshot.child("Notifications/").val();
        //   console.log(patientID.val());
        //   $("div#notificationDropdown").append('<a>' + "Patient "+patientID.val()+" fell at "+time.val() + '</a>');
        //   // document.getElementById("testingThis").innerHTML ="Patient "+patientID.val()+" fell at "+time.val();
        // });
      // }
      // startListening();
    });
  });
  console.log("notifications script is running");
}
