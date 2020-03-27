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

      htmlInjection += '<td style="width:25%;">'+reply["userEmail"]+'</td>';
      htmlInjection += '<td style="width:15%">'+reply["userID"]+'</td>';
      htmlInjection += '<td style="width:20%">'+reply["feedbackType"]+'</td>';
      htmlInjection += '<td style="width:20%">'+reply["timestamp"]+'</td>';
      htmlInjection += '<td style="width:10%"><button id="reply'+days.key+'" onclick="replyToFeedback(\''+days.key+'\')" style="cursor:pointer;">Reply</button></td>';
      htmlInjection += '<td style="width:10%"><button id="reply'+days.key+'" onclick="ViewFeedback(\''+days.key+'\')" style="cursor:pointer;">View</button></td>';
      htmlInjection += '</tr>';

      if(count = weeks.length) //if reached the end of the list of weeks
      {
        $("#FeedbackTable").html(htmlInjection); //Insert the HTML for the tasks into the DOM
      } //end if
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

/**
 * @function setWSEditFields
 * @description updates edit center schedule form with values for selected week
 * @param {*} weekOf week selected
 * @param {*} times array of times for 7 days of the selected week
 */
function setWSEditFields(times) {
  document.getElementById('viewMessage').value = times["feedbackText"];

} //end setCSEditFields
