export default {
  name: "Let's Read",
  slug: 'words-alive',
  icon: './assets/images/icons/ios.png',
  version: '1.0.0',
  android: {
    package: 'org.wordsalive.letsread',
    adaptiveIcon: {
      foregroundImage: './assets/images/icons/android.png',
    },
  },
  ios: {
    bundleIdentifier: 'org.wordsalive.letsread',
    icon: './assets/images/icons/ios.png',
  },
  splash: {
    image: './assets/images/icons/splash.png',
  },
  extra: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    firebase: JSON.parse(process.env.FB_CONFIG) || {
      apiKey: process.env.FB_API_KEY || 'AIzaSyBSJHJ-VfdN2Y3wC_vfD1k6bEU2mQmP-Vg',
      authDomain: process.env.FB_AUTH_DOMAIN || 'words-alive-staging.firebaseapp.com',
      projectId: process.env.FB_PROJECT_ID || 'words-alive-staging',
      appId: process.env.FB_APP_ID || '1:1534285739:web:2bada99614d9126d7224ee',
    },
  },
};
