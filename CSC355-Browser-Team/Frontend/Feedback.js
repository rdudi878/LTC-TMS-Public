var btnLogout = document.getElementById('btnLogout')

var fb = [];
var rowIndexFB = 1;
var fbFB = firebase.database().ref('Feedback')
var weeks = [];

//get weeks stored in an array
fbFB.once('value',function(snapshot){
  snapshot.forEach(function(Feed){
    weekOf = Feed.key;
    weeks.push(weekOf);
  });

  injectToDOM(weeks);
});

/**
* @function injectToDOM
* @description query for data for individual days given the week, then display in DOM
* @param {*} weeks array of weeks that have schedules
*/
function injectToDOM(weeks){
  var htmlInjection = "";
  count = 0;

  htmlInjection = '<table style="width:100%; border: 1px solid black;">';
  for (var i = weeks.length-1; i >= 0; i--){
    var Feedbacks = firebase.database().ref('Feedback/'+weeks[i]+'/');
    Feedbacks.once('value',function(days){
      count++;

      reply = [];
      reply = days.val();

      var cnaID = reply["userId"];
      var cnaName = "";
      var cnaRef = firebase.database().ref("CNA/"+cnaID+"/Portfolio");
      cnaRef.once("value")
      .then(function(cnaSnap) {
        cnaSnap.forEach(function(name) {
          if (name.key==="Name") {
            cnaName = name.val();
          }
        });

        htmlInjection += '<td style="width:25%;">'+cnaName+'</td>';
        htmlInjection += '<td style="width:15%">'+reply["userId"]+'</td>';
        htmlInjection += '<td style="width:20%">'+reply["feedbackType"]+'</td>';
        date = reply["timestamp"];
        var myDate = new Date(date);
        myDate = myDate.toLocaleString();
        htmlInjection += '<td style="width:20%">'+myDate+'</td>';
        htmlInjection += '<td style="width:10%"><button id="reply'+days.key+'" onclick="replyToFeedback(\''+days.key+'\')" style="cursor:pointer;">Reply</button></td>';
        htmlInjection += '<td style="width:10%"><button id="reply'+days.key+'" onclick="ViewFeedback(\''+days.key+'\')" style="cursor:pointer;">View</button></td>';
        htmlInjection += '</tr>';

        if(count = weeks.length) //if reached the end of the list of weeks
        {
          $("#FeedbackTable").html(htmlInjection); //Insert the HTML for the tasks into the DOM
        } //end if
      });
    }); //end weekSched.once('value',function(days){
  } //end for
} //end injectToDOM


function ViewFeedback(date) {
  document.getElementById('viewABlock').style.display ='block';
  console.log(date);
  var fbB= firebase.database().ref('Feedback/'+date+'/');
  fbB.on('value', function(WSsnapshot){
    var times = [];
    times = WSsnapshot.val();
    setWSEditFields(times);
  });
} //end editCenterSchedule


function setWSEditFields(times) {
  document.getElementById('viewMessage').value = times["feedbackText"];

} //end setCSEditFields


function replyToFeedback(date) {
  document.getElementById('replyView').style.display ='block';
  console.log(date);
  var temp = firebase.database().ref('Feedback/'+date+'/');
  temp.on('value', function(WSsnapshot){
    var times = [];
    times = WSsnapshot.val();
    setReplyFields(times, date);
});
}

function setReplyFields(times, date) {
  document.getElementById('IDReply').innerHTML = times["userId"];
  document.getElementById('IDCode').innerHTML = date;
} //end setCSEditFields




function replyFeedback(){
  var iD = document.getElementById('IDCode').innerHTML;
  var ReplyData = $("#replyMessage").val();

      firebase.database().ref('Feedback/'+ iD).update({
        replyText : ReplyData
      });
      document.getElementById('replyView').style.display ='none';
      location.href ="./11Feedback2.html";
} //end function submitEditCenterSchedule

function displayFeedbackNotifications() {
  var feedbackNum = 0;
  fbFB.once('value',function(snapshot){
    snapshot.forEach(function(Feed){
      feedbackNum+=1;
    });
    console.log("feedbackNum: ");
    console.log(feedbackNum);
    var notificationNum = document.getElementById("notificationNum");
    // feedbackNum = 0; // testing what it looks like when there are no new notifications
    if (feedbackNum===0) {
      notificationNum.style="display:none;"
    } else {
      notificationNum.innerHTML = feedbackNum;
    }
  });
}
