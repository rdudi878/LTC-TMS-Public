// have to fix the filter function //
//get the patient's name and put in the seleted boxes
var fbPAT = firebase.database().ref("Patient");
//grab the Patient's ID from database and put into the selected box
fbPAT.once("value")
    .then(function(snapshot){
      var nameArray = []; // Array to hold the names
        var idArray = []; // Array to hold the IDs
        var index = 0;
        snapshot.forEach(function(childSnapshot){
// The .child property is the only way I know to traverse deeper into the DB layers
          var portfolioSnap = childSnapshot.child("Portfolio")
          var nameSnap = portfolioSnap.child("Name")
          // console.log(nameSnap.node_.value_) // *****BINGO******
          // Above is how the name is referenced
          var childKey = childSnapshot.key;
          if(childKey != "EnvironmentStatus"){
            nameArray.push(nameSnap.node_.value_); // add the name into nameArray, push is add
            idArray.push(childKey); // add the ID into idArray
            var dsPat = document.getElementById("DSselectPAT");
            var vsPat = document.getElementById("VSselectPAT");
            var aiPat = document.getElementById("AIselectPAT");
            var dsOpt = document.createElement("option"); // Creating the drop down options
            var vsOpt = document.createElement("option"); // Creating the drop down options
            var aiOpt = document.createElement("option"); // Creating the drop down options
            dsOpt.text = nameArray[index]+" - "+idArray[index]; // format is Name - ID
            vsOpt.text = nameArray[index]+" - "+idArray[index]; // format is Name - ID
            aiOpt.text = nameArray[index]+" - "+idArray[index]; // format is Name - ID
              dsPat.add(dsOpt); // Appending to the drop down options
              vsPat.add(vsOpt); // Appending to the drop down options
              aiPat.add(aiOpt); // Appending to the drop down options
              index=index+1;
          }
       });
    });

    function clearBox()
{
    document.getElementById("selectCNA").innerHTML = "";
}

    var search;//search Date
    function selectPatient(){
        search = document.getElementById("bday").value;//get the date value
        var arr = search.split("-");
        if (arr[1]<10){
            arr[1] = arr[1].replace('0', '');
            console.log(arr[1]);
        }
        if(arr[2]<10){
            arr[2] = arr[2].replace('0','');
        }
        recreated_search = arr[0]+"-"+arr[1]+"-"+arr[2];
        var selected_id = document.getElementById("selectPAT").value;// get the patient's ID
        var fbPAT_CNA= firebase.database().ref("Activities/"+selected_id+"/"+recreated_search);
        //grab the Patient's ID from database and put into the selected box
        fbPAT_CNA.once("value")
            .then(function(snapshot){
                var arr = [];
                var i = 0;
                snapshot.forEach(function(childSnapshot){
                    if(childSnapshot.key != "AI"){
                        arr.push(childSnapshot.key); // add the childkey into array, push is add
                       console.log(arr[i]); // to show the key on the console
                       var y = document.getElementById("selectCNA");
                       var option = document.createElement("option");
                      option.text= arr[i];
                       y.add(option);
                       console.log(i);
                       i=i+1;
                    }
              });
        });
    }

    function click_display() {
      var srDisplayButton = document.getElementById("srDisplayButton");
      var refreshButton = document.getElementById("refreshButton");
      srDisplayButton.style.display = "none";
      refreshButton.style.display = "block";
      var dsStatInfo = document.getElementById("dailyStatTable");
      var dsRowIndex = 1;
      var cnaKey = "";
      var selectedPatient = $('#DSselectPAT').val()
      var selectedDate = $('#bday').val()
      selectedPatient = getSecondPart(selectedPatient) // Split the string to ignore the name portion of the dropdown selection
      var rootRef = firebase.database().ref();
// Note: will need to get the CNA ID some other way. Also, the DB format for the date is currently different.
      var cnaRef = rootRef.child("Activities/"+selectedPatient+"/"+selectedDate);
      cnaRef.once('value', function(cnaSnap){
        cnaSnap.forEach(function(cnaChild) {
// Pulling out the CNA ID so that it can be dynamically referenced for getting daily statuses
          cnaKey = cnaChild.key;
        });
      });
      var statusRef = rootRef.child("Activities/"+selectedPatient+"/"+selectedDate+"/"+cnaKey+"/daily_status/");
      statusRef.once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          console.log("child.key: ");
          console.log(child.key);
          if (child.key!=="submittedBy"
              && child.key!=="timestamp"
              && child.key!=="date") {
            var dsStatRow = dsStatInfo.insertRow(dsRowIndex);
            dsStatRow.setAttribute("class","table-list-row");
            var cellCompletedTasks = dsStatRow.insertCell(0)
            cellCompletedTasks.appendChild(document.createTextNode(child.key));
          }
        });
      });

      function getSecondPart(str) {
        return str.split('- ')[1];
      }
      $('#patient-info').show();
    }
    function display_vs() {
      var vsDisplayButton = document.getElementById("vsDisplayButton");
      var vsRefreshButton = document.getElementById("vsRefreshButton");
      vsDisplayButton.style.display = "none";
      vsRefreshButton.style.display = "block";
      var vsStatInfo = document.getElementById("vitalStatTable");
      var vsRowIndex = 1;
      var cnaKey = "";
      var pressuresArr = [];
      var tempsArr = [];
      var timeArr = [];
      var selectedPatient = $('#VSselectPAT').val()
      var selectedDate = $('#vs_bday').val()
      selectedPatient = getSecondPart(selectedPatient) // Split the string to ignore the name portion of the dropdown selection
      var rootRef = firebase.database().ref();
// Note: will need to get the CNA ID some other way. Also, the DB format for the date is currently different.
      var cnaRef = rootRef.child("Activities/"+selectedPatient+"/"+selectedDate);
      cnaRef.once('value', function(cnaSnap){
        cnaSnap.forEach(function(cnaChild) {
// Pulling out the CNA ID so that it can be dynamically referenced for getting vital statuses
          cnaKey = cnaChild.key;
        });
      });
      var statusRef = rootRef.child("Activities/"+selectedPatient+"/"+selectedDate+"/"+cnaKey+"/vital_status/");
      statusRef.once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          if (child.key!=="specialrecord") {
            var vsStatRow = vsStatInfo.insertRow(vsRowIndex);
            vsStatRow.setAttribute("class","table-list-row");
            var cellMeasurementTime = vsStatRow.insertCell(0)
            var cellMeasurementType = vsStatRow.insertCell(1)
            var cellMeasurementValue = vsStatRow.insertCell(2)

        // Split the time and Measurement type by "_" character
            var splitIt = child.key;
            var splitArray = splitIt.split('_');
        // Clean up the way Blood Pressure displays
            if (splitArray[0]=="BloodPressure") {
              splitArray[0] = "Blood Pressure";
            }
        // Clean up how temperature and blood pressure values display
            var value = child.val();
            if (splitArray[0]!=="Blood Pressure") {
              value = child.val()+"°F";
            } else {
              value = value.replace("~", "/");
            }

        // Append to the table
            cellMeasurementTime.appendChild(document.createTextNode(splitArray[1]));
            cellMeasurementType.appendChild(document.createTextNode(splitArray[0]));
            cellMeasurementValue.appendChild(document.createTextNode(value));
          }
        });
      });

      function getSecondPart(str) {
        return str.split('- ')[1];
      }
// These are the values of the selected date and patient name drop down
      // console.log($('#selectPAT').val());
      // console.log($('#bday').val());
// Display the patient info window
      $('#patient-info').show();
    }
    function display_ai() {
      var aiDisplayButton = document.getElementById("aiDisplayButton");
      var aiRefreshButton = document.getElementById("aiRefreshButton");
      aiDisplayButton.style.display = "none";
      aiRefreshButton.style.display = "block";
      var aiStatInfo = document.getElementById("aiStatTable");
      var aiRowIndex = 1;
      var cnaKey = "";
      var pressuresArr = [];
      var tempsArr = [];
      var timeArr = [];
      var selectedPatient = $('#AIselectPAT').val();
      var selectedDate = $('#ai_bday').val()
      console.log(selectedDate);
      selectedPatient = getSecondPart(selectedPatient); // Split the string to ignore the name portion of the dropdown selection
      var rootRef = firebase.database().ref();
// Note: will need to get the CNA ID some other way. Also, the DB format for the date is currently different.
//       var cnaRef = rootRef.child("Activities/"+selectedPatient+"/"+selectedDate);
//       cnaRef.once('value', function(cnaSnap){
//         cnaSnap.forEach(function(cnaChild) {
// // Pulling out the CNA ID so that it can be dynamically referenced for getting vital statuses
//           cnaKey = cnaChild.key;
//         });
//       });
      var categoryRef = rootRef.child("Activities/"+selectedPatient+"/"+selectedDate+"/AI/");
      categoryRef.once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          if (child.key!=="HeartRateRecord"
              && child.key!=="Location") {
            var aiStatRow = aiStatInfo.insertRow(aiRowIndex);
            aiStatRow.setAttribute("class","table-list-row");
            var cellMeasurementType = aiStatRow.insertCell(0)
            var valueRef = categoryRef.child(child.key+"/")
            valueRef.once("value", function(snapshot2) {
              snapshot2.forEach(function(child) {
                var cellMeasurementValue = aiStatRow.insertCell(1);
                cellMeasurementValue.appendChild(document.createTextNode(child.val()));
              });
            });
            cellMeasurementType.appendChild(document.createTextNode(child.key));
          }
        });
      });

      function getSecondPart(str) {
        return str.split('- ')[1];
      }
// These are the values of the selected date and patient name drop down
      // console.log($('#selectPAT').val());
      // console.log($('#bday').val());
// Display the patient info window
      $('#patient-info').show();
    }

    function refreshPage() {
      location.reload();
    }

    var count = 0;
    function display_button(nnn,room){
      document.getElementById("no-doc1").style.display = "none";
      document.getElementById("no-doc2").style.display = "none";
      document.getElementById("no-doc3").style.display = "none";
      document.getElementById("no-doc4").style.display = "none";
      document.getElementById("no-doc5").style.display = "none";

        if(count%2 == 1){//  in order to exchange the text of button into "display" and"refresh"
            nnn .value= "Refresh";
            location.reload();//reload the page
            }
        nnn.value = "Refresh";
        count = count + 1;
        var selected_id = document.getElementById("selectPAT").value;// get the patient's ID
        var selected_CNA = document.getElementById("selectCNA").value

        var fbRoom = firebase.database().ref("Patient/"+selected_id+"/Portfolio/patientRoomNo")
        fbRoom.once("value")
            .then(function(snapshot){
            var room = snapshot.val();
            var fbEnv= firebase.database().ref("Activities/EnvironmentStatus/"+recreated_search+"/"+room);
            fbEnv.once("value")
                .then(function(snapshot1){
                    snapshot1.forEach(function(childSnapshot1){
                        var row = Environmenttable.insertRow(1);
                        var roomNo = row.insertCell(0)
                        var time = row.insertCell(1);
                        var val = row.insertCell(2);
                        var th = childSnapshot1.val();
                        th = th.replace(/[*+?^${}()|→TH]/g," ");
                        roomNo.appendChild(document.createTextNode(room));
                        time.appendChild(document.createTextNode(childSnapshot1.key));
                        val.appendChild(document.createTextNode(th));
                    })
                })
            })

        var fbPAT_DRS = firebase.database().ref("Activities/"+selected_id+"/"+recreated_search+"/"+selected_CNA+"/daily_status");
        fbPAT_DRS.once("value")
            .then(function(snapshot){
                var index = 0;
                snapshot.forEach(function(childSnapshot){
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    var row = DSR_table.insertRow(1);
                    var time = row.insertCell(0)
                    var Evt = row.insertCell(1);
                    var val = row.insertCell(2);
                    var a = childKey.split("_");

                    if(a[1] == "Oxygen Used" ){
                        row.remove();
                        var SCrow = SC_table.insertRow(1);
                        var SCtime = SCrow.insertCell(0)
                        var SCEvt = SCrow.insertCell(1);
                        var SCval = SCrow.insertCell(2);
                        childData = childData.replace(/[*+?^${}()"|]/g,"");
                        SCtime.appendChild(document.createTextNode(a[0]));
                        SCEvt.appendChild(document.createTextNode(a[1]));
                        SCval.appendChild(document.createTextNode(childData));
                    }
                    if(a[1] == "Steam Used"){
                        row.remove();
                        var SCrow = SC_table.insertRow(1);
                        var SCtime = SCrow.insertCell(0)
                        var SCEvt = SCrow.insertCell(1);
                        var SCval = SCrow.insertCell(2);
                        childData = childData.replace(/[*+?^${}()"|]/g,"");
                        SCtime.appendChild(document.createTextNode(a[0]));
                        SCEvt.appendChild(document.createTextNode(a[1]));
                        SCval.appendChild(document.createTextNode(childData));
                    }
                    else{
                        time.appendChild(document.createTextNode(a[0]));
                        Evt.appendChild(document.createTextNode(a[1]));
                        if(childData == "true"){
                            childData = "Yes";
                            val.appendChild(document.createTextNode(childData));
                        }
                        else{
                            val.appendChild(document.createTextNode(childData));
                        }
                    }
                })
            })

            var fbPAT_AI = firebase.database().ref("Activities/"+selected_id+"/"+recreated_search+"/AI");
                fbPAT_AI.once("value")
                .then(function(snapshot){
                    snapshot.forEach(function(childSnapshot){
                        console.log(childSnapshot.key);
                        if(childSnapshot.key =="HeartRate"){
                            childSnapshot.forEach(function(childSnapshot1){
                                var row = AI_table.insertRow(1);
                                var a = childSnapshot1.val().split("→");
                                var heartRate = row.insertCell(0)
                                var time = row.insertCell(1);
                                var rate = row.insertCell(2);
                                a[0] = a[0].replace("?","");
                                a[0] = a[0].replace(/[~]/g,":");
                                a[1] = a[1].replace(/[?'"]/g," ");
                                heartRate.appendChild(document.createTextNode(childSnapshot.key));
                                time.appendChild(document.createTextNode(a[0]));
                                rate.appendChild(document.createTextNode(a[1]));
                            })
                        }
                        if(childSnapshot.key =="HeartRateRecord"){
                            childSnapshot.forEach(function(childSnapshot1){
                                var row = heartRateRecord.insertRow(1);
                                var heartRate = row.insertCell(0)
                                var time = row.insertCell(1);
                                var rate = row.insertCell(2);
                                var hm = childSnapshot1.key.replace(/[~]/g,":");
                                var val = childSnapshot1.val().replace(/[?'"]/g,"");
                                heartRate.appendChild(document.createTextNode(childSnapshot.key));
                                time.appendChild(document.createTextNode(hm));
                                rate.appendChild(document.createTextNode(val));
                            })
                        }
                        if(childSnapshot.key =="Step"){
                            childSnapshot.forEach(function(childSnapshot1){
                                var row = AI_table.insertRow(1);
                                var a = childSnapshot1.val().split("→");
                                var Step = row.insertCell(0)
                                var time = row.insertCell(1);
                                var totalStep = row.insertCell(2);
                                a[0] = a[0].replace("~",":");
                                a[0] = a[0].replace("?","");
                                a[1] = a[1].replace(/[?]/g," ");

                                Step.appendChild(document.createTextNode(childSnapshot.key));
                                time.appendChild(document.createTextNode(a[0]));
                                totalStep.appendChild(document.createTextNode(a[1]));
                            })
                        }
                        var BreakException = {};
                        if(childSnapshot.key =="Location"){

                                childSnapshot.forEach(function(childSnapshot1){
                                    try {//break
                                    childSnapshot1.forEach(function(childSnapshot2){
                                        var row = AI_table.insertRow(1);
                                        var lastvisit = row.insertCell(0);
                                        var time = row.insertCell(1);
                                        var place = row.insertCell(2)
                                        var hs = childSnapshot2.key.replace("~",":");
                                        lastvisit.appendChild(document.createTextNode("Last Visit:"));
                                        place.appendChild(document.createTextNode(childSnapshot1.key));
                                        time.appendChild(document.createTextNode(hs));
                                        throw BreakException;
                                    })
                                }
                                catch (e) {
                                    if (e !== BreakException) throw e;
                                }

                            })
                        }
                        if(childSnapshot.key =="Location"){

                                childSnapshot.forEach(function(childSnapshot1){
                                    childSnapshot1.forEach(function(childSnapshot2){
                                        var row = VisitRecord.insertRow(1);

                                        var lastvisit = row.insertCell(0);
                                        var time = row.insertCell(1);
                                        var place = row.insertCell(2)
                                        var hs = childSnapshot2.key.replace("~",":");
                                        lastvisit.appendChild(document.createTextNode("Location:"));
                                        place.appendChild(document.createTextNode(childSnapshot1.key));
                                        time.appendChild(document.createTextNode(hs));
                                    })
                                })

                            }


                })
            })

            var fbPAT_VSR = firebase.database().ref("Activities/"+selected_id+"/"+recreated_search+"/"+selected_CNA+"/vital_status");
                fbPAT_VSR.once("value")
                .then(function(snapshot){
                    var array = [];
                    var array_val = [];
                    var index = 0;
                    snapshot.forEach(function(childSnapshot){
                        var childKey = childSnapshot.key;
                        var childData = childSnapshot.val();
                        array.push(childKey);
                        console.log(childData);
                        console.log(array[index]);
                        var row = VSR_table.insertRow(1);
                        var time = row.insertCell(0)
                        var Evt = row.insertCell(1);
                        var val = row.insertCell(2);

                        var a = childKey.split("_");

                        time.appendChild(document.createTextNode(a[0]));
                        Evt.appendChild(document.createTextNode(a[1]));

                        if(childData == "true"){
                            childData = "Yes";
                            val.appendChild(document.createTextNode(childData));
                        }
                        else{
                            childData = childData.replace(/[*+?^${}()"|/]/g,"");
                            if(childData.includes("~") == true){
                                childData = childData.replace("~","/");
                            }
                            val.appendChild(document.createTextNode(childData));
                        }
                })
            })
}

function viewMore(){
    document.getElementById("form").style.display = "block";
}
function close_form(){
    document.getElementById("form").style.display = "none";
}

window.onload=function(){
// displaying the current date
    var today = new Date();
    var dd = today.getDate();
    var mm_index = today.getMonth(); //January is 0!
    var year = today.getFullYear();
    var weekday =  ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
     var wk_index = today.getDay();

     if (dd<10){
         dd = "0"+dd;
     }
     document.getElementById('current_date').innerHTML = dd;
     document.getElementById("current_month").innerHTML = month[mm_index];
     document.getElementById("current_week").innerHTML = weekday[wk_index];
     document.getElementById("current_year").innerHTML = year;

     //defaut date is today's  patinet's vital record
     var mm = mm_index+1; // to make the month correct; For example: January is 0 , so add 1;
     // in order to have same format with "bday". orignal is 2018-9-13
     if(mm_index<9){
         var mm = "0"+mm;
     }
    var nowadays = year +"-"+ mm+"-"+ dd; // 2018-09-13
    document.getElementById("bday").value = nowadays;
    var a = new Date();
    var hour = a.getHours();
    var minute = a.getMinutes();
    var second = a.getSeconds();

    var time = hour+":"+minute+":"+second;
     console.log(time);


        if(time<"12:00:00" && time>="04:00:00"){
        document.getElementById("time").innerHTML = "Good Morning &nbsp ";
      }
      if(time>="12:00:00" && time<"18:00:00"){
      document.getElementById("time").innerHTML = "Good Afternoon &nbsp ";
    }
      if(time>="18:00:00" || time<"04:00:00"){
    document.getElementById("time").innerHTML = "Good Evening &nbsp ";
    }


}



function sortvisitrecord(){
  console.log("123");
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("VisitRecord");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[2];
      y = rows[i + 1].getElementsByTagName("TD")[2];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
function sortDSR(){
  console.log("123");
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("DSR_table");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function sortAI(){
  console.log("123");
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("AI_table");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[1];
      y = rows[i + 1].getElementsByTagName("TD")[1];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
function sortVSR(){
  console.log("123");
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("VSR_table");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
function sortENV(){
  console.log("123");
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("Environmenttable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
function sortHRR(){
  console.log("123");
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("heartRateRecord");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[1];
      y = rows[i + 1].getElementsByTagName("TD")[1];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}


function showdsr(){
  document.getElementById("DsOptions").style.display = "block";
  document.getElementById("VsOptions").style.display = "none";
  document.getElementById("AiOptions").style.display = "none";
  document.getElementById("ScOptions").style.display = "none";
  document.getElementById("data1").style.display = "block";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "none";
  document.getElementById("data4").style.display = "none";
  document.getElementById("data5").style.display = "none";
  document.getElementById("dsrspan").style.opacity = "1";
  document.getElementById("vsrspan").style.opacity = ".8";
  document.getElementById("aisspan").style.opacity = ".8";
  document.getElementById("scspan").style.opacity = ".8";
  document.getElementById("ecspan").style.opacity = ".8";
}
function showvsr(){
  document.getElementById("DsOptions").style.display = "none";
  document.getElementById("VsOptions").style.display = "block";
  document.getElementById("AiOptions").style.display = "none";
  document.getElementById("ScOptions").style.display = "none";
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "block";
  document.getElementById("data3").style.display = "none";
  document.getElementById("data4").style.display = "none";
  document.getElementById("data5").style.display = "none";
  document.getElementById("dsrspan").style.opacity = ".8";
  document.getElementById("vsrspan").style.opacity = "1";
  document.getElementById("aisspan").style.opacity = ".8";
  document.getElementById("scspan").style.opacity = ".8";
  document.getElementById("ecspan").style.opacity = ".8";
}
function showais(){
  document.getElementById("DsOptions").style.display = "none";
  document.getElementById("VsOptions").style.display = "none";
  document.getElementById("AiOptions").style.display = "block";
  document.getElementById("ScOptions").style.display = "none";
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "block";
  document.getElementById("data4").style.display = "none";
  document.getElementById("data5").style.display = "none";
  document.getElementById("dsrspan").style.opacity = ".8";
  document.getElementById("vsrspan").style.opacity = ".8";
  document.getElementById("aisspan").style.opacity = "1";
  document.getElementById("scspan").style.opacity = ".8";
  document.getElementById("ecspan").style.opacity = ".8";
}
function showsc(){
  document.getElementById("DsOptions").style.display = "none";
  document.getElementById("VsOptions").style.display = "none";
  document.getElementById("AiOptions").style.display = "none";
  document.getElementById("ScOptions").style.display = "block";
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "none";
  document.getElementById("data4").style.display = "block";
  document.getElementById("data5").style.display = "none";
  document.getElementById("dsrspan").style.opacity = ".8";
  document.getElementById("vsrspan").style.opacity = ".8";
  document.getElementById("aisspan").style.opacity = ".8";
  document.getElementById("scspan").style.opacity = "1";
  document.getElementById("ecspan").style.opacity = ".8";
}
function showec(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "none";
  document.getElementById("data4").style.display = "none";
  document.getElementById("data5").style.display = "block";
  document.getElementById("dsrspan").style.opacity = ".8";
  document.getElementById("vsrspan").style.opacity = ".8";
  document.getElementById("aisspan").style.opacity = ".8";
  document.getElementById("scspan").style.opacity = ".8";
  document.getElementById("ecspan").style.opacity = "1";
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


function profile(){
  document.getElementById("profile").style.display = "block";
}

function closeprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "none";
}

function editprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "block";
}

function cancelprofile(){
  window.location.reload()
}

function submitprofile(){

}
