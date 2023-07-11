export const firebaseConfig = {
  projectId: "com-dudynets-news",
  appId: "1:873523207518:web:a8b072d0ec0d06d06b83cf",
  storageBucket: "com-dudynets-news.appspot.com",
  apiKey: "AIzaSyBKB00c85MylrfERf54swbHFOWN7UKMnng",
  authDomain: "com-dudynets-news.firebaseapp.com",
  messagingSenderId: "873523207518",
};

// iOS client ID can be found in GoogleService-Info.plist
// Android client ID can be found in google-services.json
// Do not forget to both files to the ios and android capacitor directories
export const firebaseAuthConfig = {
  iosClientId:
    '873523207518-dqru0hfhichorou9ktgkn5c54bbf77j8.apps.googleusercontent.com',
  // Due to a bug in Capacitor GoogleAuth plugin, the value of androidClientId has to be set to the web client ID
  // @see https://github.com/CodetrixStudio/CapacitorGoogleAuth/issues/220
  androidClientId:
    '873523207518-7iugldivhe7og4gudkelimppd2uih0ta.apps.googleusercontent.com',
};
