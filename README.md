<a href="https://dudynets.pp.ua">
  <img src="https://user-images.githubusercontent.com/39008921/191470114-c074b17f-1c88-4af3-b089-1b14418cabf5.png" alt="drawing" width="128"/>
</a>

# Angular News App

<p><strong>News App written with Angular, Ionic and Firebase.</strong></p>

> Developed by [Oleksandr Dudynets](https://dudynets.pp.ua)

## Run Steps

1. Clone the repository.
```sh
git clone https://github.com/dudynets/Angular-News-App
```
2. Install NPM packages (requires Yarn Package Manager installed).
```sh
yarn install
```
3. Create a new Firebase project in the [Firebase console](https://console.firebase.google.com/).
4. Add a new web app to the project in the Firebase console.
   1. Copy the Firebase config from the Firebase console into the `firebase.config.ts` file.
5. Install Angular CLI and Firebase CLI.
```sh
npm install -g @angular/cli firebase-tools
```
6. Make sure you have Java JDK version 11 or higher installed and added to system PATH.
7. Login to Firebase.
```sh
firebase login
```
8. Choose a Firebase project to use.
```sh
firebase use [YOUR_PROJECT_ID]
```
9. Run the app in development mode (will run the Firebase emulator suite as well).
```sh
yarn start:emulators
yarn start:web
```
10. Open the app in a browser at http://localhost:4200, login with Google and create a new user.
11. Open the Emulator Suite UI in the browser at http://localhost:4000, go to Firestore and add a `role` field with value `writer` to the user you just created.

## Deployment Steps

1. Complete the steps 1-5, 7-8 from the [Run Steps](#run-steps) section.
2. Enable the Firebase Google authentication provider in the Firebase console.
3. Enable the Firestore database in the Firebase console.
4. Enable the Storage service in the Firebase console.
5. Run the deployment script.
```sh
yarn firebase:deploy
```
6. You should see the app URL in the console output.
7. Open the app in a browser at the URL from the previous step, login with Google and create a new user.
8. Open the Firebase console, go to Firestore and add a `role` field with value `writer` to the user you just created.

## iOS Setup Steps

For running the app on iOS make sure that:
1. You have Xcode installed.
2. You have command-line tools installed.
3. You have created an iOS app in Firebase Console and copied the `GoogleService-Info.plist` file to the `ios/App/App` folder.
4. You have set the `iosClientId` from the `GoogleService-Info.plist` file in the `firebase.config.ts` file.
5. You have set the `REVERSED_CLIENT_ID` in the `ios/App/App/Info.plist` file.

Check [this tutorial](https://www.youtube.com/watch?v=GwtpoWZ_78E) for more information on how to set up Firebase Authentication for iOS.

## Android Setup Steps

For running the app on Android make sure that:
1. You have Android Studio installed.
2. You have created an Android app in Firebase Console and copied the `google-services.json` file to the `android/app` folder.
3. You have set the `androidClientId` from the `google-services.json` file in the `firebase.config.ts` file.
4. You have set SHA certificate fingerprints in the Firebase Console.

Check [this tutorial](https://www.youtube.com/watch?v=GwtpoWZ_78E) for more information on how to set up Firebase Authentication for Android.

## Notes

- Make sure you have the latest stable version of Node.js installed (tested with Node.js v18.16.0).
- If Firebase emulators cannot start due to the port conflict, reboot your system and try again.
- Do not forget to change all the existing Firebase config values in the `firebase.config.ts`, `ios/App/App/Info.plist` files to the values from your Firebase project.

## License

Distributed under the [MIT](https://choosealicense.com/licenses/mit/) License.
See [LICENSE](https://github.com/dudynets/Angular-News-App) for more information.
