// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDA0V9CBhm8qOuPAb5XiYU1c98EzhnUmU8",
    authDomain: "darkmoon-web-api-2.firebaseapp.com",
    projectId: "darkmoon-web-api-2",
    storageBucket: "darkmoon-web-api-2.appspot.com",
    messagingSenderId: "1088055651694",
    appId: "1:1088055651694:web:9dac06980307f981e9657f",
    measurementId: "G-M7YKW42JZT"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

