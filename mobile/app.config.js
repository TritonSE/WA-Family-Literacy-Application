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
  extra: {
    BASE_URL: process.env.BASE_URL,
  },
};
