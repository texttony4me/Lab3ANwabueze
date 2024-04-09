import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyAWg0U5r9HFa2dXsNfhYW4pimRueXDLgXs",
  authDomain: "advancedtopics-7d2f5.firebaseapp.com",
  projectId: "advancedtopics-7d2f5",
  storageBucket: "advancedtopics-7d2f5.appspot.com",
  messagingSenderId: "883867001043",
  appId: "1:883867001043:web:1b7540669b098ef5007426"
  };

  firebase.initializeApp(firebaseConfig);
  export default firebase;