export default {
  name: "Let's Read with Words Alive!",
  slug: 'words-alive',
  icon: './assets/images/logo.png',
  version: '1.0.0',
  android: {
    package: 'org.wordsalive.letsread',
    adaptiveIcon: {
      foregroundImage: './assets/images/logo-small.png'
    }
  },
  extra: {
    BASE_URL: process.env.BASE_URL,
  },
};
