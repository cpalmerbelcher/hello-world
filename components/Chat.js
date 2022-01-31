import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';


export default class Chat extends React.Component {
  render() {
    // Set the background color selected from start screen
    const { bgColor } = this.props.route.params;
    return (
      <View style={{
        flex: 1,
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor: bgColor ? bgColor : "#fff",}}>
        <View style={styles.giftedChat}>
           {/* <GiftedChat
              renderBubble={this.renderBubble.bind(this)}
              renderInputToolbar={this.renderInputToolbar.bind(this)}
              messages={this.state.messages}
              user={this.state.user}
              onSend={messages => this.onSend(messages)}
              renderActions={this.renderCustomActions}
              renderCustomView={this.renderCustomView}
              user={{
                _id: this.state.user._id,
                name: this.state.name,
                avatar: this.state.user.avatar
              }}
            /> */}
            { Platform.OS === 'android' ? (
              <KeyboardAvoidingView behavior="height" />
              ) : null}
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center', 
    justifyContent:'center'
  },
  giftedChat: {
    flex: 1,
    width: "88%",
    paddingBottom: 10,
    justifyContent: "center",
    borderRadius: 5,
  },

});

