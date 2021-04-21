import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyDuVy2Sn78VfVAFRgUJCOaq8d7W6yQpSUg",
    authDomain: "nlwpodcastr.firebaseapp.com",
    databaseURL: "https://nlwpodcastr-default-rtdb.firebaseio.com",
    projectId: "nlwpodcastr",
    storageBucket: "nlwpodcastr.appspot.com",
    messagingSenderId: "951169744799",
    appId: "1:951169744799:web:f636080b811638eeab87aa"
};
// Initialize Firebase
firebase.apps.length===0&&firebase.initializeApp(firebaseConfig);

const database = firebase.database()

export {firebase, database as default}

// console.log(firebase)