import firebase from "firebase"
require("@firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyC92q2aTNAh_--yCEpcbv-cO1FwQfnk-GA",
  authDomain: "e-ride-25f01.firebaseapp.com",
  projectId: "e-ride-25f01",
  storageBucket: "e-ride-25f01.appspot.com",
  messagingSenderId: "216219885233",
  appId: "1:216219885233:web:a7bea16a2bc1ec216c8c90"
};
  
  if(! firebase.apps.length)
  firebase.initializeApp(firebaseConfig)

  export default firebase.firestore()