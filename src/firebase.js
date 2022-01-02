import { initializeApp } from "firebase/app"


const firebaseConfig = {
  apiKey: "AIzaSyCG6GPbj83IzhcqDv3700cQP3oBVuHNtBY",
  authDomain: "mpos-dbce8.firebaseapp.com",
  projectId: "mpos-dbce8",
  storageBucket: "mpos-dbce8.appspot.com",
  messagingSenderId: "139969501580",
  appId: "1:139969501580:web:0e05cbe72050868a975ea9"
  /*
  apiKey: "AIzaSyD1sOpbh3wHfhvjPAClF7NXv5D-QJF5ddY",
  authDomain: "mpos-17801.firebaseapp.com",
  projectId: "mpos-17801",
  storageBucket: "mpos-17801.appspot.com",
  messagingSenderId: "457327738469",
  appId: "1:457327738469:web:a3674a6c3d03b46209908c"
  */
};

const firebaseApp = initializeApp(firebaseConfig);

import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
const db = getFirestore();
enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

export default firebaseApp
