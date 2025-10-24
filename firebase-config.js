// firebase-config.js
// Cole aqui a configuração do seu projeto Firebase.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyB1sxAAtkZGIRRMI5wMhZXvNZsNF9yoH1c",
  authDomain: "acervifrj.firebaseapp.com",
  projectId: "acervifrj",
  storageBucket: "acervifrj.firebasestorage.app",
  messagingSenderId: "552950386573",
  appId: "1:552950386573:web:2761de2e72e40ae84fb7c4",
  measurementId: "G-SRCDMC1VKQ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
