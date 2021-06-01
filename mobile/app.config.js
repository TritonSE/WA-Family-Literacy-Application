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
    baseUrl: process.env.BASE_URL || 'https://api.wordsalive.org',
    firebase: process.env.FB_CONFIG ? JSON.parse(process.env.FB_CONFIG) : {
      "apiKey":"AIzaSyBBhNjTHRJmGmuSnfqcVBp4EJTd3d2JIsI",
      "authDomain":"words-alive-a3392.firebaseapp.com",
      "projectId":"words-alive-a3392",
      "appId":"1:242541796284:web:06e49d66e778256577e9b9"
    },
  },
};
