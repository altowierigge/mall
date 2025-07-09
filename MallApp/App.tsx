// Main App Component
// Entry point for the Mall React Native App

import React from 'react';
import { Provider } from 'react-redux';
import { StyleSheet } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;