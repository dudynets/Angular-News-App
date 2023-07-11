import {CapacitorConfig} from '@capacitor/cli';
import {environment} from './src/environments/environment';

const config: CapacitorConfig = {
  appId: 'com.dudynets.news',
  appName: 'News',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email', 'openid'],
      iosClientId: environment.googleAuth.iosClientId,
      androidClientId: environment.googleAuth.androidClientId,
    },
    SplashScreen: {
      launchAutoHide: false,
    },
  },
};

export default config;
