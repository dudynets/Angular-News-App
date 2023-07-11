import {firebaseAuthConfig, firebaseConfig} from '../../firebase.config';

export const environment = {
  firebase: {
    projectId: 'demo-news-app',
    appId: firebaseConfig.appId,
    storageBucket: 'demo-news-app.appspot.com',
    apiKey: firebaseConfig.apiKey,
    authDomain: 'demo-news-app.firebaseapp.com',
    messagingSenderId: firebaseConfig.messagingSenderId,
  },
  googleAuth: {
    iosClientId: firebaseAuthConfig.iosClientId,
    androidClientId: firebaseAuthConfig.androidClientId,
  },
  useEmulators: true,
  production: false,
};
