import React from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, Keyboard, Button, LogBox } from 'react-native';
// import AsyncStorage from "@react-native-async-storage/async-storage";

import * as firebase from 'firebase';
import "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2vpotAEZc-i3elRehUCasAUAIUXebbOk",
  authDomain: "chat-app-1d4b6.firebaseapp.com",
  projectId: "chat-app-1d4b6",
  storageBucket: "chat-app-1d4b6.appspot.com",
  messagingSenderId: "911925814339",
  appId: "1:911925814339:web:b5437b761babe1d54160f6",
  measurementId: "G-KQKT8C76MW"
};

export default class Chat extends React.Component {
  constructor(props) {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
          _id: "",
          name: "",
          avatar: "",
      },
      isConnected: false,
      image: null,
      location: null,
  };

  // Initialize Firebase
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
      }

    // reference to the Firestore messages collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.refMsgsUser = null;
  
  componentDidMount(); {
    // Set the page title once Chat is loaded
    let { name } = this.props.route.params
    // Adds the name to top of screen
    this.props.navigation.setOptions({ title: name })

    // To find out user's connection status
    NetInfo.fetch().then(connection => {
        //actions when user is online
        if (connection.isConnected) {
            this.setState({ isConnected: true });
            console.log('online');

      //listens for updates in the collection
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate)
        
      //user can sign in anonymously
      this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
            await firebase.auth().signInAnonymously();
        }
        //update user state with currently active user data
        this.setState({
            uid: user.uid,
            messages: [],
            user: {
                _id: user.uid,
                name: name,
                avatar: "",
            },
        });
        //referencing messages of current user
        this.refMsgsUser = firebase
          .firestore()
          .collection("messages")
           .where("uid", "==", this.state.uid);
        });
        //save messages when online
        this.saveMessages();
        } else {
            //when user is offline
            this.setState({ isConnected: false });
            console.log('offline');
            //retrieve chat from asyncstorage
            this.getMessages();
        }   
    });
  }

  // when updated set the messages state with the current data 
  onCollectionUpdate = (querySnapshot) => { 
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
        // get the QueryDocumentSnapshot's data
        let data = doc.data();
        messages.push({
            _id: data._id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
                _id: data.user._id,
                name: data.user.name,
                avatar: data.user.avatar
            },
            image: data.image || null,
            location: data.location || null,
        });
    });
    this.setState({
        messages: messages
    });
};

  //unsubscribe from collection updates
  componentWillUnmount(); {
      this.authUnsubscribe();
      this.unsubscribe();
  }

  // Add messages to database
  addMessages(); { 
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
        _id: message._id,
        text: message.text || "",
        createdAt: message.createdAt,
        user: this.state.user,
        image: message.image || "",
        location: message.location || null,
    });
  }

  //callback function when a user sends a message
  onSend(messages = []); {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  //customize the chat bubble background color
  renderBubble(props); {
    return (
      <Bubble {...props}
        wrapperStyle={{
          right: {backgroundColor: '#000'},
        }}
      />
    )
  }

  render(); {
    // Set the background color selected from start screen
    const { bgColor } = this.props.route.params;
    return (
        <View style={{
            flex: 1,
            alignItems:'center', 
            justifyContent:'center', 
            backgroundColor: bgColor ? bgColor : "#fff",}}>
            <View style={styles.giftedChat}>
            <GiftedChat
                renderDay={this.renderDay}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                renderBubble={this.renderBubble.bind(this)}
                renderInputToolbar={this.renderInputToolbar.bind(this)}
                renderActions={this.renderCustomActions}
                renderCustomView={this.renderCustomView}
                user={{
                    _id: this.state.user._id,
                    name: this.state.name,
                    avatar: this.state.user.avatar
                }}
                />
                { Platform.OS === 'android' ? (
                    <KeyboardAvoidingView behavior="height" />
                ) : null}
            </View>
        </View>
    )
  }
}

// const styles = StyleSheet.create({
//   container: {
//       flex: 1,
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center'
//   },
//   giftedChat: {
//       color: '#000',
//   },
}
