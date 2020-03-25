var btnLogout = document.getElementById('btnLogout')


//Create new Announcement button

function AddNewA(){
  document.getElementById('newABlock').style.display ='block';
}

//Read firebase Announcements
var an =[];
var fbA = firebase.database().ref('Announcements');
var Atable = document.getElementById('table')
var rowIndex = 1;

fbA.once('value',function(snapshot){
  snapshot.forEach(function(childSnapshot){
    an[rowIndex] = childSnapshot.key
    var childData = childSnapshot.val();
    var button = document.createElement("button");
    var button2 = document.createElement("button");
    var button3 = document.createElement("button");
    button.innerHTML="Detail";
    button2.innerHTML = "Edit";
    button3.innerHTML="Delete";

    var row = Atable.insertRow(rowIndex);
    var cellAnnouncement= row.insertCell(0);
    var cellButton= row.insertCell(1)
    var cellButton2= row.insertCell(2);
    var cellButton3= row.insertCell(3);

    cellAnnouncement.appendChild(document.createTextNode(childData.ATitleIOS));
    cellButton.appendChild(button);
    cellButton2.appendChild(button2);
    cellButton3.appendChild(button3);

    button.setAttribute("id","viewA_id["+rowIndex+"]");
    button.setAttribute("onclick","viewA("+rowIndex+")");
    button2.setAttribute("id","editA_id["+rowIndex+"]");
    button2.setAttribute("onclick","editA("+rowIndex+")");
    button3.setAttribute("id","deleteA_id["+rowIndex+"]");
    button3.setAttribute("onclick","deleteA("+rowIndex+")");

    rowIndex = rowIndex + 1;
  }); //end function(childSnapchot)
}); //end

//createNew Announcement Data
function createNewAnnouncement(){
  var data = $('#Announcement').val();
  var title1= $('#Atitle').val();
  var title2= 'xtsx'+title1+'xtex';
  var data2 = 'xasx' + data + 'xaex';
  var keyA = fbA.push().key;
  var AData = {
    a_id : keyA,
    ATitleAndroid: title2 ,
    ATitleIOS:title1 ,
    AnnouncementAndroid:data2,
    AnnouncementIOS: data
  }
  var updates = {};
  if(data == ""){
    alert(' Please input a data');
  }
  else {
    updates['Announcements/'+ keyA] = AData;
    firebase.database().ref().update(updates);
    alert('Successfully Entered');
    window.location.reload();
  }
} //end function createNewAnnouncement

//Deleting Announcements
function deleteA(rowIndex){
  var fbB= firebase.database().ref('Announcements');
  var Ukey = an[rowIndex];
  console.log(Ukey);
  var r = confirm("Are you sure you want to delete an announcement?");
  if (r == true) {
    fbB.child(Ukey).remove();
    alert("successfully deleted!");
    window.location.reload();
  }
  else {
  }
} //end function deleteA

//View Announcement, no editing
//WIP
function viewA(rowIndex){
  document.getElementById('viewABlock').style.display ='block';
  var Ukey = an[rowIndex];
  var fbB= firebase.database().ref('Announcements/'+Ukey);
  fbB.on('value', function(snapshot){
    var EAdata = snapshot.child('AnnouncementIOS').val();
    var EAdata2 = snapshot.child('ATitleIOS').val();
    document.getElementById('Amsg2').innerHTML = EAdata;
    document.getElementById('AEtitle3').innerHTML = EAdata2;
    document.getElementById('keyname').innerHTML = Ukey;
  });
} //end function viewA

//Edit Announcement, no viewing
function editA(rowIndex){
  document.getElementById('editABlock').style.display ='block';
  var Ukey = an[rowIndex];
  var fbB= firebase.database().ref('Announcements/'+Ukey);
  fbB.on('value', function(snapshot){
    var EAdata = snapshot.child('AnnouncementIOS').val();
    var EAdata2 = snapshot.child('ATitleIOS').val();
    document.getElementById('Amsg').value = EAdata;
    document.getElementById('AEtitle2').value = EAdata2;
    document.getElementById('keyname').innerHTML = Ukey;
  });
} //end function editA

function editSave(rowIndex){
  var editedData = $("#Amsg").val();
  var editedData2 = 'xasx' + editedData + 'xaex';
  var akey = document.getElementById('keyname').innerHTML;
  console.log(akey);
  var title1= $('#AEtitle2').val();
  var title2= 'xtsx'+title1+'xtex';
  var wholeA ={
    ATitleIOS: title1,
    ATitleAndroid: title2 ,
    AnnouncementAndroid: editedData2,
    AnnouncementIOS: editedData,
    a_id: akey
  };
  if(editedData == ""){
    alert(' Please input a data');
  }
  else {
    var updates={};
    updates['Announcements/'+ akey] = wholeA;
    firebase.database().ref().update(updates);
    window.location.reload();
  }
} //end function editSave



function btnpopUp(){
  document.getElementById('Esave').style.display = "inline";
} //end function btnpopUP


//Create new Working Schedule - Upload folder into firebase
//var uploader3 = document.getElementById('uploader3');
//var fileButton3 = document.getElementById('fileButton3');
//var submitfileButton3 = document.getElementById('btnSubmitCS');

//fileButton3.addEventListener('change', handleuploadfile3);
//submitfileButton3.addEventListener('click', handleuploadfileSubmit3);

//let file3;

function handleuploadfile3(e) {
  file3=e.target.files[0];
} //end function handleuploadfile3

function handleuploadfileSubmit3(e) {
  if(file3 == undefined){
    alert ("Please enter data!")
  }
}

//Display CS table
var cs = [];
var rowIndexCS = 1;
var fbCS = firebase.database().ref('CenterSchedule')
var weeks = [];

//get weeks stored in an array
fbCS.once('value',function(snapshot){
  snapshot.forEach(function(Week){
    weekOf = Week.key;
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
    var weekSched = firebase.database().ref('CenterSchedule/'+weeks[i]+'/');
    weekSched.once('value',function(days){
      count++;

      times = [];
      times = days.val();

      htmlInjection += '<tr><td style="width:10%; font-weight:bold;">'+days.key+'</td>';
      htmlInjection += '<td style="width:10%;">'+times["Sunday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Monday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Tuesday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Wednesday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Thursday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Friday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Saturday"]+'</td>';
      htmlInjection += '<td style="width:10%"><button id="edit'+days.key+'" onclick="editCenterSchedule(\''+days.key+'\')" style="cursor:pointer;">Edit</button></td>';
      htmlInjection += '<td style="width:10%"><button id="delete'+days.key+'" onclick="deleteCenterSchedule(\''+days.key+'\')" style="cursor:pointer;">Delete</button></td>';
      htmlInjection += '</tr>';

      if(count = weeks.length) //if reached the end of the list of weeks
      {
        $("#CenterScheduleInfo").html(htmlInjection); //Insert the HTML for the tasks into the DOM
      } //end if
    }); //end weekSched.once('value',function(days){
  } //end for
} //end injectToDOM










//Display Working Schedule table !!!!!Still in progress!!!!!!!!!!!
var ws = [];
var rowIndexWS = 1;
var fbWS = firebase.database().ref('WorkingSchedule')
var work = [];

//get weeks stored in an array
fbWS.once('value',function(snapshot){
  snapshot.forEach(function(Week){
    weekOf = Week.key;
    work.push(weekOf);
  });

  injectToWS(work);
});

/**
* @function injectToWS
* @description query for data for individual days given the week, then display in DOM
* @param {*} weeks array of weeks that have schedules
*/
function injectToWS(work){
  var htmlInjection = "";
  count = 0;

  htmlInjection = '<table style="width:100%; border: 1px solid black;">';
  for (var i = work.length-1; i >= 0; i--){
    var weekSched = firebase.database().ref('WorkingSchedule/'+work[i]+'/');
    weekSched.once('value',function(days){
      count++;

      times = [];
      times = days.val();

      htmlInjection += '<tr><td style="width:10%; font-weight:bold;">'+days.key+'</td>';
      htmlInjection += '<td style="width:10%;">'+times["Sunday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Monday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Tuesday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Wednesday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Thursday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Friday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Saturday"]+'</td>';
      htmlInjection += '<td style="width:10%"><button id="edit'+days.key+'" onclick="editWorkingSchedule(\''+days.key+'\')" style="cursor:pointer;">Edit</button></td>';
      htmlInjection += '</tr>';

      if(count = work.length) //if reached the end of the list of weeks
      {
        $("#workingScheduleInfo").html(htmlInjection); //Insert the HTML for the tasks into the DOM
      } //end if
    }); //end weekSched.once('value',function(days){
  } //end for
} //end injectToCOM

/**
 * @function editWorkingSchedule
 * @description queries for selected center schedule, calls to fill form
 * @param {*} date selected center schedule to be edited
 */
function editWorkingSchedule(date) {
  document.getElementById('editWorkBlock').style.display ='block';
  console.log(date);
  var fbB= firebase.database().ref('WorkingSchedule/'+date);
  fbB.on('value', function(WSsnapshot){
    var times = [];
    times = WSsnapshot.val();
    setWSEditFields(WSsnapshot.key, times);
  });
} //end editCenterSchedule

/**
 * @function setWSEditFields
 * @description updates edit center schedule form with values for selected week
 * @param {*} weekOf week selected
 * @param {*} times array of times for 7 days of the selected week
 */
function setWSEditFields(weekOf, times) {
  document.getElementById('editCNAws').innerHTML = weekOf;
  document.getElementById('editWSSun').value = times["Sunday"];
  document.getElementById('editWSMon').value = times["Monday"];
  document.getElementById('editWSTue').value = times["Tuesday"];
  document.getElementById('editWSWed').value = times["Wednesday"];
  document.getElementById('editWSThu').value = times["Thursday"];
  document.getElementById('editWSFri').value = times["Friday"];
  document.getElementById('editWSSat').value = times["Saturday"];
} //end setCSEditFields

/**
 * @function submitEditCenterSchedule
 * @description submits edited center schedule
 */
function submitEditWorkingSchedule(){
  var ymd = document.getElementById('editCNAws').innerHTML

  var SunDataW = $("#editWSSun").val();
  var MonDataW = $("#editWSMon").val();
  var TueDataW = $("#editWSTue").val();
  var WedDataW = $("#editWSWed").val();
  var ThuDataW = $("#editWSThu").val();
  var FriDataW = $("#editWSFri").val();
  var SatDataW = $("#editWSSat").val();

  //create alert message
  var fields = "";
  if(ymd == ""){fields += "CNA\n";}
  if(SunDataW == ""){fields += "Sunday\n";}
  if(MonDataW == ""){fields += "Monday\n";}
  if(TueDataW == ""){fields += "Tuesday\n";}
  if(WedDataW == ""){fields += "Wednesday\n";}
  if(ThuDataW == ""){fields += "Thursday\n";}
  if(FriDataW == ""){fields += "Friday\n";}
  if(SatDataW == ""){fields += "Saturday\n";}
  if(ymd == "" || SunDataW == "" || MonDataW == "" ||
  TueDataW == "" || WedDataW == "" || ThuDataW == "" ||
  FriDataW == "" || SatDataW == "") {
    alert ("Please enter the following data:\n"+fields);
  }

  else {
    var r = confirm("Are you sure you want edit this CNA's Schedule?");
    if (r == true) {

      var data = {
        Sunday : SunDataW,
        Monday : MonDataW,
        Tuesday : TueDataW,
        Wednesday : WedDataW,
        Thursday : ThuDataW,
        Friday : FriDataW,
        Saturday : SatDataW
      }

      var updates = {};
      updates['WorkingSchedule/'+ymd] = data;
      firebase.database().ref().update(updates);
      document.getElementById('editWorkBlock').style.display ='none';
      location.href ="./02Schedule2.html";
    } //end if
  } //end else
} //end function submitEditCenterSchedule

function AddNewWS(){
  document.getElementById("NewWSSun").value = "";
  document.getElementById("NewWSMon").value = "";
  document.getElementById("NewWSTue").value = "";
  document.getElementById("NewWSWed").value = "";
  document.getElementById("NewWSThu").value = "";
  document.getElementById("NewWSFri").value = "";
  document.getElementById("NewWSSat").value = "";
  //document.getElementById("selected_date").value = year+"-"+mm+"-"+dd;
  document.getElementById('newWSBlock').style.display ='block';
}

function createNewWorkingSchedule(){
  var cna = $("#NewCNA").val();

  var SunData = $("#NewWSSun").val();
  var MonData = $("#NewWSMon").val();
  var TueData = $("#NewWSTue").val();
  var WedData = $("#NewWSWed").val();
  var ThuData = $("#NewWSThu").val();
  var FriData = $("#NewWSFri").val();
  var SatData = $("#NewWSSat").val();

  //create alert message
  var fields = "";
  if(cna == ""){fields += "CNA\n";}
  if(SunData == ""){fields += "Sunday\n";}
  if(MonData == ""){fields += "Monday\n";}
  if(TueData == ""){fields += "Tuesday\n";}
  if(WedData == ""){fields += "Wednesday\n";}
  if(ThuData == ""){fields += "Thursday\n";}
  if(FriData == ""){fields += "Friday\n";}
  if(SatData == ""){fields += "Saturday\n";}

  if(cna == "" || SunData == "" || MonData == "" ||
  TueData == "" || WedData == "" || ThuData == "" ||
  FriData == "" || SatData == "") {
    alert ("Please enter the following data:\n"+fields);
  }

  else {
    var r = confirm("Are you sure you want to create a new Center Schedule?");
    if (r == true) {

      var data = {
        Sunday : SunData,
        Monday : MonData,
        Tuesday : TueData,
        Wednesday : WedData,
        Thursday : ThuData,
        Friday : FriData,
        Saturday : SatData
      }

      var updates = {};
      updates['WorkingSchedule/'+cna] = data;
      firebase.database().ref().update(updates);
      document.getElementById('newWSBlock').style.display ='none';
      location.href ="./02Schedule2.html";
    }
  }
} //end function createNewCenterSchedule


















/**
 * @function createNewCenterSchedule
 * @description creates new center schedule for the week
 */
function createNewCenterSchedule(){
  var ymd = $("#selected_date").val();

  var SunData = $("#NewCSSun").val();
  var MonData = $("#NewCSMon").val();
  var TueData = $("#NewCSTue").val();
  var WedData = $("#NewCSWed").val();
  var ThuData = $("#NewCSThu").val();
  var FriData = $("#NewCSFri").val();
  var SatData = $("#NewCSSat").val();

  //create alert message
  var fields = "";
  if(ymd == ""){fields += "Week Of\n";}
  if(SunData == ""){fields += "Sunday\n";}
  if(MonData == ""){fields += "Monday\n";}
  if(TueData == ""){fields += "Tuesday\n";}
  if(WedData == ""){fields += "Wednesday\n";}
  if(ThuData == ""){fields += "Thursday\n";}
  if(FriData == ""){fields += "Friday\n";}
  if(SatData == ""){fields += "Saturday\n";}

  if(ymd == "" || SunData == "" || MonData == "" ||
  TueData == "" || WedData == "" || ThuData == "" ||
  FriData == "" || SatData == "") {
    alert ("Please enter the following data:\n"+fields);
  }

  else {
    var r = confirm("Are you sure you want to create a new Center Schedule?");
    if (r == true) {

      var data = {
        Sunday : SunData,
        Monday : MonData,
        Tuesday : TueData,
        Wednesday : WedData,
        Thursday : ThuData,
        Friday : FriData,
        Saturday : SatData
      }

      var updates = {};
      updates['CenterSchedule/'+ymd] = data;
      firebase.database().ref().update(updates);
      document.getElementById('newCSBlock').style.display ='none';
      location.href ="./02Schedule2.html";
    }
  }
} //end function createNewCenterSchedule


/**
 * @function editCenterSchedule
 * @description queries for selected center schedule, calls to fill form
 * @param {*} date selected center schedule to be edited
 */
function editCenterSchedule(date) {
  document.getElementById('editWSBlock').style.display ='block';
  console.log(date);
  var fbB= firebase.database().ref('CenterSchedule/'+date);
  fbB.on('value', function(CSsnapshot){
    var times = [];
    times = CSsnapshot.val();
    setCSEditFields(CSsnapshot.key, times);
  });
} //end editCenterSchedule

/**
 * @function setCSEditFields
 * @description updates edit center schedule form with values for selected week
 * @param {*} weekOf week selected
 * @param {*} times array of times for 7 days of the selected week
 */
function setCSEditFields(weekOf, times) {
  document.getElementById('editWeekOf').innerHTML = weekOf;
  document.getElementById('editCSSun').value = times["Sunday"];
  document.getElementById('editCSMon').value = times["Monday"];
  document.getElementById('editCSTue').value = times["Tuesday"];
  document.getElementById('editCSWed').value = times["Wednesday"];
  document.getElementById('editCSThu').value = times["Thursday"];
  document.getElementById('editCSFri').value = times["Friday"];
  document.getElementById('editCSSat').value = times["Saturday"];
} //end setCSEditFields

/**
 * @function submitEditCenterSchedule
 * @description submits edited center schedule
 */
function submitEditCenterSchedule(){
  var ymd = document.getElementById('editWeekOf').innerHTML

  var SunData = $("#editCSSun").val();
  var MonData = $("#editCSMon").val();
  var TueData = $("#editCSTue").val();
  var WedData = $("#editCSWed").val();
  var ThuData = $("#editCSThu").val();
  var FriData = $("#editCSFri").val();
  var SatData = $("#editCSSat").val();

  //create alert message
  var fields = "";
  if(ymd == ""){fields += "Week Of\n";}
  if(SunData == ""){fields += "Sunday\n";}
  if(MonData == ""){fields += "Monday\n";}
  if(TueData == ""){fields += "Tuesday\n";}
  if(WedData == ""){fields += "Wednesday\n";}
  if(ThuData == ""){fields += "Thursday\n";}
  if(FriData == ""){fields += "Friday\n";}
  if(SatData == ""){fields += "Saturday\n";}
  if(ymd == "" || SunData == "" || MonData == "" ||
  TueData == "" || WedData == "" || ThuData == "" ||
  FriData == "" || SatData == "") {
    alert ("Please enter the following data:\n"+fields);
  }

  else {
    var r = confirm("Are you sure you want edit this Center Schedule?");
    if (r == true) {

      var data = {
        Sunday : SunData,
        Monday : MonData,
        Tuesday : TueData,
        Wednesday : WedData,
        Thursday : ThuData,
        Friday : FriData,
        Saturday : SatData
      }

      var updates = {};
      updates['CenterSchedule/'+ymd] = data;
      firebase.database().ref().update(updates);
      document.getElementById('editWSBlock').style.display ='none';
      location.href ="./02Schedule2.html";
    } //end if
  } //end else
} //end function submitEditCenterSchedule

/**
 * @function deleteCenterSchedule
 * @description deletes center schedule for selected week from the database
 * @param {*} date selected center schedule to be removed
 */
function deleteCenterSchedule(date) {
  var fbB= firebase.database().ref('CenterSchedule');
  console.log(date);
  var r = confirm("Are you sure you want to delete the center schedule for the week of "+date+"?");
  if (r == true) {
    fbB.child(date).remove();
    alert("successfully deleted!");
    location.href ="./02Schedule2.html";
  } //end if
  else {
  }
} //end deleteCenterSchedule

//Working Schedule table
function AddNewCS(){
  document.getElementById("NewCSSun").value = "";
  document.getElementById("NewCSMon").value = "";
  document.getElementById("NewCSTue").value = "";
  document.getElementById("NewCSWed").value = "";
  document.getElementById("NewCSThu").value = "";
  document.getElementById("NewCSFri").value = "";
  document.getElementById("NewCSSat").value = "";
  //document.getElementById("selected_date").value = year+"-"+mm+"-"+dd;
  document.getElementById('newCSBlock').style.display ='block';
}

//WS deletion
function deleteWS(rowIndexWS){
  var fbWS= firebase.database().ref('WorkingSchedule');
  //var Ukey = $(this).closest('tr').children('td:first').text();
  var Ukey = ws[rowIndexWS];
  console.log(Ukey);
  var r = confirm("Are you sure you want to delete a working schedule?");
  if (r == true) {
    fbWS.child(Ukey+"/filename").once('value').
    then(function(snapshot){
      var storageRef=firebase.storage().ref();
      storageRef.child("WorkingSchedule/"+snapshot.val()).delete().then(function(){
        fbWS.child(Ukey).remove();
        alert("successfully deleted!");
        window.location.reload();
      });
    });
  }
  else {
  }
}

//WS download
function downloadWS(rowIndexWS){
  var fbWS= firebase.database().ref('WorkingSchedule');
  console.log(rowIndexWS);
  //var Ukey = $(this).closest('tr').children('td:first').text();
  var Ukey = ws[rowIndexWS];
  var url = fbWS.child(Ukey).child('url');
  let downloadURL;
  url.once("value").then(function(snapshot){
    downloadURL = snapshot.val();
    console.log(downloadURL);
    window.open(downloadURL,'_blank');
  });
}

/* Reveals the selected page in a block and hides the unwanted page */
function showannouncement(){
  document.getElementById("data1").style.display = "block";
  document.getElementById("data3").style.display = "none";
  document.getElementById("data4").style.display = "none";
  document.getElementById("announcementspan").style.opacity = "1";
  document.getElementById("wsspan").style.opacity = ".8";
  document.getElementById("schspan").style.opacity = ".8";
}

function showws(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data3").style.display = "block";
  document.getElementById("data4").style.display = "none";
  document.getElementById("announcementspan").style.opacity = ".8";
  document.getElementById("wsspan").style.opacity = "1";
  document.getElementById("schspan").style.opacity = ".8";
}

function showsch(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data3").style.display = "none";
  document.getElementById("data4").style.display = "block";
  document.getElementById("announcementspan").style.opacity = ".8";
  document.getElementById("wsspan").style.opacity = ".8";
  document.getElementById("schspan").style.opacity = "1";
}

function openmenu(){
  if(document.getElementById("menu").style.display== "block"){
    document.getElementById("menu").style.display = "none";
    document.getElementById("openmenu").style.opacity = "1";
  }
  else{
    document.getElementById("menu").style.display = "block";
    document.getElementById("openmenu").style.opacity = ".6";
  }
}
