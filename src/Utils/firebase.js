// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, getDoc } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZKZHTDEVVTNyOMZmkOLm_3cL7WUi4Fz8",
  authDomain: "memorygame-88e52.firebaseapp.com",
  projectId: "memorygame-88e52",
  storageBucket: "memorygame-88e52.appspot.com",
  messagingSenderId: "1012678189579",
  appId: "1:1012678189579:web:af10a73429b1d403ca5d0e",
  measurementId: "G-D7WJWT0G2K"
};

export default class MyDB {
  constructor(){
    this.initializeDB();
  }

  initializeDB() {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    // Initialize Cloud Firestore and get a reference to the service
    this.db = getFirestore(this.app);
    console.log('Firebase initiallized!', this.db);
  }

  //for this demo I'll keep it to the user 'visitor' for all time
  //later I can switch to a whole system of login and register stuff
  async getGameStatus(){
    this.user = null;
    const docRef = doc(this.db, "User", "visitor");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      this.user = docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  async saveGameStatus(userData) {
    const {score, time, cards, move, difficulty} = userData;
    await setDoc(doc(this.db,"User","visitor"), {
      score:score,
      time:time,
      cards:cards,
      move:move,
      difficulty:difficulty,
    });
  }
}
