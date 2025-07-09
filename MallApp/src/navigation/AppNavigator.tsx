// App Navigator
// Root navigation structure for the mall app

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import { RootStackParamList } from './types';
import { theme } from '../utils/theme';

// Import navigators and screens
import TabNavigator from './TabNavigator';
import ShopWebViewScreen from '../screens/Shop/ShopWebViewScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
        translucent={false}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="ShopWebView"
          component={ShopWebViewScreen}
          options={{
            headerShown: true,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: theme.colors.surface,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '600',
              color: theme.colors.text,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;