import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export const Heading: React.FC = () => {
  return (
    <View>
      <View style={styles.topbox} />
      <View style={styles.box} />
      <View style={styles.container}>
        <View style={styles.circle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topbox: {
    height: height * 0.35,
    marginTop: height * -0.35,
    backgroundColor: '#E89228',
  },
  box: {
    height: height * 0.30,
    backgroundColor: '#E89228',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: width * 0.2,
    overflow: 'hidden',
  },
  circle: {
    backgroundColor: '#E89228',
    height: width * 1.9,
    width: width * 1.9,
    borderRadius: width,
    marginTop: width * -(1.7),
  },
});
