/**
 * @file Server.js
 * @author  MCU
 * @author  Kutztown University
 * @license
 */

 // contact firebase to varify and display admin information
var firebase=require("firebase");
var config = {
  apiKey: "AIzaSyDTQfbN-Ag-GN1z0pI-kIRnc4LtUB83NPw",
  authDomain: "csc354-a604d.firebaseapp.com",
  databaseURL: "https://csc354-a604d.firebaseio.com",
  projectId: "csc354-a604d",
  storageBucket: "csc354-a604d.appspot.com",
  messagingSenderId: "786974548917",
  appId: "1:786974548917:web:504b52b9ef22062c9daffc",
  measurementId: "G-8KLJLYJMS2"
 };
 firebase.initializeApp(config);

//Admin SDK setup
var admin = require("firebase-admin");

var serviceAccount = require("/Users/Gama/Documents/GitHub/shared-LTC-TMS/LTCTMS/share-b7589-firebase-adminsdk-9gtpk-8d7012282d");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://browserteam.firebaseio.com"
});

//Functions
var functions = require("firebase-functions");

exports.createUser= functions.database.ref('uAccount/{sid}')
  .onCreate((snapshot, context)=>{
  var id = context.params.sid;
  console.log( 'id ='+ id);
  var childData = snapshot.val();

  return admin.auth().createUser({
      uid : id,
      email: childData.Email,
      displayName:childData.Name,
      password: childData.Password,
      disabled:false,
      emailVerified: true
  }).then(function(userRecord){
    console.log("user", userRecord.toJSON());
    var updates={};
    var userData=userRecord.toJSON();
    console.log(userData);
    var updatedList = JSON.parse(JSON.stringify(userData));
    console.log(updatedList);
    updates['AuthenticationData']= updatedList;
    return snapshot.ref.update(updates);
  }).catch(function(error){
    console.log(error.message);
  });
});

//Deletion Back end
exports.deleteUser=functions.database.ref('uAccount/{sid}')
  .onDelete((deleteshot,context)=>{
    var id = context.params.sid;
    console.log('id ='+ id);
    var childData = deleteshot.val();
    return admin.auth().deleteUser(id)
      .then(function(){
        return firebase.database().ref('AccountStatus/'+id).remove();
        console.log('Successfully deleted the target User');
      }).catch(function(error){
        console.log(error.message);
      });
  });

//Update Back end
exports.updateUser=functions.database.ref('uAccount/{sid}')
  .onUpdate((change,context)=>{

    var id = context.params.sid;
    console.log('id ='+ id);
    var bchildData = change.before.val();
    var childData = change.after.val();
    if(childData.Email === bchildData.Email &&
      childData.Name === bchildData.Name &&
      childData.StaffID === bchildData.StaffID &&
      childData.Password === bchildData.Password){
      console.log('it will not update data!');
      return null ;
    }else{
      return admin.auth().updateUser(id,{
        email:childData.Email,
        displayName: childData.Name,
        uid:childData.StaffID,
        password:childData.Password,
        disabled:false,
        emailVerified: true
      }).then(function(userRecord){
        console.log("user", userRecord.toJSON());
        var updates={};
        var userData=userRecord.toJSON();
        console.log(userData);
        var updatedList = JSON.parse(JSON.stringify(userData));
        console.log(updatedList);
        updates['AuthenticationData']= updatedList;
        return change.after.ref.update(updates);
      }).catch(function(error){
        console.log(error.message);
      });

    }

  });

// //check for new notifications
// exports.createNotification= functions.database.ref('Notifications/{nid}')
//   .onCreate((snapshot, context)=>{
//     var id = context.params.nid;
//     console.log("Notification ID:");
//     console.log(nid);
//   }
