import React, { Component } from 'react';
// import react native gesture handler
import 'react-native-gesture-handler';
// import { StyleSheet, View, Text, TextInput, Button, ScrollView } from 'react-native';
//import react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import the components
import Start from './components/Start';
import Chat from './components/Chat';

//create the navigator
const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={Start}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
