import * as firebase from 'firebase/app'

if (!firebase.getApps().length) {
  const firebaseConfig = {
    apiKey: 'AIzaSyC7_B8Bq7-aiaawyBzb1jDL0YKlHfihjJ0',
    authDomain: 'heihei-377d8.firebaseapp.com',
    projectId: 'heihei-377d8',
    storageBucket: 'heihei-377d8.appspot.com',
    messagingSenderId: '824449804571',
    appId: '1:824449804571:web:4d12769e6dd27151accbbe',
    measurementId: 'G-ZPZYWLW2ZK',
  }

  firebase.initializeApp(firebaseConfig)
}
