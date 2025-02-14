import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDq5bbP9rrN1pPxmtoTYoSDQLNdhV7napI',
  authDomain: 'educacioncontinua-cd5ec.firebaseapp.com',
  projectId: 'educacioncontinua-cd5ec',
  storageBucket: 'educacioncontinua-cd5ec.firebasestorage.app',
  messagingSenderId: '982198736323',
  appId: '1:982198736323:web:038b1de134230b518b9976',
  measurementId: 'G-NV0KWCNSWC',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
