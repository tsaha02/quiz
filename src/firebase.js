import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyCWf4Ax_2ghvwdpuOtm46Jy7PX_82GQnwQ",
  authDomain: "quiz-app-50f86.firebaseapp.com",
  projectId: "quiz-app-50f86",
  storageBucket: "quiz-app-50f86.appspot.com",
  messagingSenderId: "801404599226",
  appId: "1:801404599226:web:2ed84404282e7028ba7b83",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const database = firebase.database();

export default firebase;
