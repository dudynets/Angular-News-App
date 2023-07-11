import {firebaseAuthConfig, firebaseConfig} from '../../firebase.config';

export const environment = {
  firebase: {
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId,
    storageBucket: firebaseConfig.storageBucket,
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    messagingSenderId: firebaseConfig.messagingSenderId,
  },
  googleAuth: {
    iosClientId: firebaseAuthConfig.iosClientId,
    androidClientId: firebaseAuthConfig.androidClientId,
  },
  useEmulators: false,
  production: true,
};
