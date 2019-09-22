import firebase from 'firebase/app';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyARcDQEFmrLLL8WHVxiPDf2Pw-JZ2pULPs",
    authDomain: "africauto-motors.firebaseapp.com",
    databaseURL: "https://africauto-motors.firebaseio.com",
    projectId: "africauto-motors",
    storageBucket: "africauto-motors.appspot.com",
    messagingSenderId: "325187327572",
    appId: "1:325187327572:web:a31ba21828ea63225ebfc1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();

export {
    storage, firebase as default
}