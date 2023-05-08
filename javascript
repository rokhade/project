# project
import React, { Component } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { dialogflow } from 'react-native-dialogflow';

const BOT_USER = {
  _id: 2,
  name: 'Bot',
  avatar: 'https://placeimg.com/140/140/any',
};

class ChatBot extends Component {
  state = {
    messages: [
      {
        _id: 1,
        text: 'Hello! How can I assist you today?',
        createdAt: new Date(),
        user: BOT_USER,
      },
    ],
    options: [
      { id: 1, text: 'Get weather information' },
      { id: 2, text: 'Get news updates' },
    ],
  };

  componentDidMount() {
    dialogflow.setConfiguration(
      'YOUR_CLIENT_ACCESS_TOKEN',
      dialogflow.LANG_ENGLISH_US
    );
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    let message = messages[0].text;
    dialogflow.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error)
    );
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
    if (text === 'Get weather information') {
      this.sendWeatherResponse();
    } else if (text === 'Get news updates') {
      this.sendNewsResponse();
    } else {
      this.sendBotResponse('Sorry, I did not understand your request.');
    }
  }

  sendWeatherResponse() {
    let msg = {
      _id: this.state.messages.length + 1,
      text: 'The weather is currently sunny with a high of 72°F.',
      createdAt: new Date(),
      user: BOT_USER,
    };
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  sendNewsResponse() {
    let msg = {
      _id: this.state.messages.length + 1,
      text:
        'Here are the latest news headlines: 1. Local team wins championship. 2. New restaurant opens in town. 3. World leaders meet at G7 summit.',
      createdAt: new Date(),
      user: BOT_USER,
    };
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{ _id: 1 }}
          options={this.state.options}
        />
      </View>
    );
  }
}

export default ChatBot;
