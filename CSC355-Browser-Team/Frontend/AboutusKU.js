var fbAboutus = firebase.database().ref("CenterInformation/KUContactInfo/Aboutus");
fbAboutus.once("value")
.then(function(snapshot){
    document.getElementById("aboutus_text").innerHTML = snapshot.val();
})


function aboutus_edit(){
    document.getElementById("aboutus_text").disabled = false;
    document.getElementById("aboutus_button").style.display = "block";
}

function aboutus_submit(){
    var text = $("#aboutus_text").val();
    document.getElementById("aboutus_text").disabled = true;
    document.getElementById("aboutus_button").style.display = "none";

    firebase.database().ref("CenterInformation/KUContactInfo/Aboutus").set(text);
    firebase.database().ref("CenterInformation/KUContactInfo/AboutusAndroid").set(text+"(end)");
    alert("Succesfully entered");

}

var fbCI = firebase.database().ref("CenterInformation/ContactInfo/Aboutus");
fbCI.once("value")
.then(function(snapshot){
  document.getElementById("centerinfo_text").innerHTML = snapshot.val();
})


function centerinfo_edit(){
  document.getElementById("centerinfo_text").disabled = false;
  document.getElementById("CI_button").style.display = "block";
}

function CI_submit(){
  var text = $("#centerinfo_text").val();
  document.getElementById("centerinfo_text").disabled = true;
  document.getElementById("CI_button").style.display = "none";

  firebase.database().ref("CenterInformation/ContactInfo/Aboutus").set(text);
  firebase.database().ref("CenterInformation/ContactInfo/AboutusAndroid").set(text+"(end)");
  alert("Succesfully entered");

}



function upload(){
    var text = $("#url_text").val();
    var name = $("#sponsorName").val();
    var file = $("#fileButton").get(0).files[0];
    console.log(file);
    if ( text == "" || name =="" || file == null){
      alert ("Please input all data!");
    }
    else{
    //firebase.database().ref("CenterInformation/"+"Sponsor/"+name+"/url").set(text);
    var storageRef = firebase.storage().ref('Sponsor/'+file.name);
    var uploadState = storageRef.put(file);
    uploadState.on('state_changed',
    function(){

    },
    function err(error){
      alert(error.message);
    },
    function complete(){
      storageRef.getDownloadURL().then(function (furl) {
      var data ={
        url: text,
        photo:furl,
        photoname:file.name
      }
      updates={};
      updates['CenterInformation/Sponsor/'+name]=data;
      firebase.database().ref().update(updates);
      alert("success");
      window.location.reload();
    });
    }
    )



  }
}


var sp = [];
var index = 0;
var fbSponsor = firebase.database().ref("CenterInformation/Sponsor");
fbSponsor.once("value")
.then(function(snapshot){
    var sponsorTD = document.getElementById("sponsor_td");
    var img = document.createElement("IMG");
    var link = [];
    var i =0;
    snapshot.forEach(function(childSnapshot1){
        sp[index] = childSnapshot1.key;
        index++;
        console.log(childSnapshot1.key);
        childSnapshot1.forEach(function(childSnapshot2){
            var sponsorTD = document.getElementById("sponsor_td");
            var img = document.createElement("img");
            var button = document.createElement("button");

            var newLink = document.createElement("a");
            newLink.id ="link["+i+"]"
            var Link = document.getElementById("link["+i+"]");

            if(childSnapshot2.key == "photo"){
                img.src = childSnapshot2.val();
                sponsorTD.appendChild(newLink);
                newLink.appendChild(img);
                img.style.width= "100px";
                img.style.height = "100px";
                img.style.margin = "20px";
                sponsorTD.appendChild(button);
                button.setAttribute("id","button_id["+i+"]");
                button.setAttribute("onclick","remove("+i+")");
                button.setAttribute("style","display:none;")
                button.innerHTML="X";

            }
            if(childSnapshot2.key == "url"){
                console.log(childSnapshot2.val());
                console.log("link["+i+"]");
                document.getElementById("link["+i+"]").href= childSnapshot2.val();
                //document.getElementById("link["+i+"]").onclink= ff();

            }
        });
        i++;

    });
})

function remove(sponsor){
    var fbSP= firebase.database().ref("CenterInformation/"+"Sponsor/"+sp[sponsor]);
    var r = confirm("Are you sure you want to remove a sponsor?");
    if (r == true) {
        fbSP.child("/photoname").once('value').
        then(function(snapshot){
            var storageRef=firebase.storage().ref();
            storageRef.child("Sponsor/"+snapshot.val()).delete().then(function(){
               fbSP.remove();
                 alert("successfully deleted!");
                 window.location.reload();
           });
        });
    }
    else {
    }
}

function sponsor_delete(){

        if(document.getElementById("deleteBTN").innerHTML !="Remove"){
            document.getElementById("deleteBTN").innerHTML ="Remove"
          for(var i=0; i< index; i++){
            document.getElementById("button_id["+i+"]").style.display = "none";
        }
      }
        else{
            document.getElementById("deleteBTN").innerHTML ="Cancel"
          for(var i=0; i< index; i++){
              console.log("button_id["+i+"]");
            document.getElementById("button_id["+i+"]").style.display = "inline";
        }
    }
}


function showintroductionKU(){
  document.getElementById("data1").style.display = "block";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "none";
  document.getElementById("introductionspan").style.opacity = "1";
  document.getElementById("centerinfospan").style.opacity = ".8";
  document.getElementById("sponsoredspan").style.opacity = ".8";
}

function showcenterinfoKU(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "block";
  document.getElementById("data3").style.display = "none";
  document.getElementById("introductionspan").style.opacity = ".8";
  document.getElementById("centerinfospan").style.opacity = "1";
  document.getElementById("sponsoredspan").style.opacity = ".8";
}

function showsponsored(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "block";
  document.getElementById("introductionspan").style.opacity = ".8";
  document.getElementById("centerinfospan").style.opacity = ".8";
  document.getElementById("sponsoredspan").style.opacity = "1";
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
