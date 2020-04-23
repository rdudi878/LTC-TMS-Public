$(document).ready(function(){

  var rootRef = firebase.database().ref();
  var streamRef = rootRef.child("Livestream");
  streamRef.once("value", function(snapshot) {
  });

  var streamRef = rootRef.child("Livestream/");
  streamRef.once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      if (child.key=="Status") {
        if (child.val()=="on") {
          setTimeout(function () {
            document.getElementById("loadingVid").style.display = 'none';
          }, 5000);
        } else {
          document.getElementById("liveStream").style.display = 'none';
          document.getElementById("streamIsDown").style.display = 'block';
          setTimeout(function () {
            document.getElementById("loadingVid").style.display = 'none';
          }, 5000);
        }
      }
    });
  });
});
