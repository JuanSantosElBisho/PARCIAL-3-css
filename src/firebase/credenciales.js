// Importamos la función para inicializar la aplicación de Firebase
import { initializeApp } from "firebase/app";

// Añade aquí tus credenciales
const firebaseConfig = {
  apiKey: "AIzaSyCZPR1juXUaj0HkWZzGQl7mBgk_HX4iLf0",
  authDomain: "tenis-f1670.firebaseapp.com",
  projectId: "tenis-f1670",
  storageBucket: "tenis-f1670.appspot.com",
  messagingSenderId: "404710885367",
  appId: "1:404710885367:web:4cbc25cd92255a689c50f2",
  measurementId: "G-31BG7M26XT"
};

// Inicializamos la aplicación y la guardamos en firebaseApp
const firebaseApp = initializeApp(firebaseConfig);
// Exportamos firebaseApp para poder utilizarla en cualquier lugar de la aplicación
export default firebaseApp;

