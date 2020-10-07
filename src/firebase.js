  import firebase from 'firebase';

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAN3VszjS1VyK9m1IlDRZGH3j6iW9oGmk0",
    authDomain: "arclone-instagram.firebaseapp.com",
    databaseURL: "https://arclone-instagram.firebaseio.com",
    projectId: "arclone-instagram",
    storageBucket: "arclone-instagram.appspot.com",
    messagingSenderId: "70879508093",
    appId: "1:70879508093:web:a8f026a697f0d4708c6314",
    measurementId: "G-ZJSFFG991S"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {
    db,
    auth,
    storage
  };