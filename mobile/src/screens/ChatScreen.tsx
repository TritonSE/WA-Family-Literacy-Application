import React, { useContext, useEffect, useState } from 'react';
import {
  Linking,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { I18nContext } from '../context/I18nContext';
import { TextStyles } from '../styles/TextStyles';
import { Colors } from '../styles/Colors';
import { ChatAPI } from '../api/ChatAPI';
import { ChatRoom, Message } from '../models/Chat';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const chatAPI = new ChatAPI();

/**
 * Left tab on navbar for chatting with volunteers
 */
export const ChatScreen: React.FC = () => {
  const auth = useContext(AuthContext);
  const [roomId, setRoomId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [chatRoomData, setChatRoomData] = useState<ChatRoom>();
  const i18nCtx = useContext(I18nContext);

  const onMessagesChange = (changedMessages: Message[]): void => {
    setMessages((oldMessages) => [...oldMessages, ...changedMessages]);
  };

  const onRoomDataChange = (room: ChatRoom): void => {
    setChatRoomData(room);
  };

  // Use roomId from previous session if exist
  useEffect(() => {
    AsyncStorage.getItem('chatRoomId').then((id) => setRoomId(id));
  }, []);

  // Subscribe to chat room data changes
  useEffect(() => {
    if (roomId) {
      return chatAPI.listenForRoomDetails(roomId, onRoomDataChange);
    }
  }, [roomId]);

  // Chat room data changed (ie. chat was resolved / rated)
  useEffect(() => {
    if (chatRoomData) {
      const { id, resolved, rating } = chatRoomData;
      if (resolved && rating) {
        // Reset chat
        AsyncStorage.removeItem('chatRoomId');
        setMessages([]);
        setRoomId(undefined);
      } else if (messages.length === 0) {
        // Subscribe to new chat messages
        return chatAPI.listenForNewMessages(id, onMessagesChange);
      }
    }
  }, [chatRoomData]);

  const sendMessage = async (): Promise<void> => {
    let newRoomId: string;
    if (!roomId) {
      // Create a new room if no previous roomId
      newRoomId = await chatAPI.createRoom(auth.user);
      setRoomId(newRoomId);
      AsyncStorage.setItem('chatRoomId', newRoomId);
    }
    chatAPI.sendMessage(
      roomId || newRoomId,
      messageText,
      auth.user?.name
    );
    setMessageText('');
  };

  const rateChat = (): void => {
    chatAPI.rateChat(roomId, 4);
  };

  return (
    <>
      <View style={styles.container}>
        {messages.map(({ id, text, from }) => {
          return (
            <Text key={id}>
              {text}, from: {from}
            </Text>
          );
        })}
        {!roomId && (
          <Text>Have any questions or concerns? Send us a message.</Text>
        )}
        {chatRoomData && chatRoomData.resolved && !chatRoomData.rating && (
          <TouchableOpacity onPress={rateChat}>
            <Text>Leave a rating.</Text>
          </TouchableOpacity>
        )}
        <TextInput value={messageText} onChangeText={setMessageText} />
        <TouchableOpacity onPress={sendMessage}>
          <Text>send</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.container, { display: 'none' }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo-white.png')}
            style={styles.logo}
          />
        </View>

        <Text style={TextStyles.heading1}>{i18nCtx.t('liveChat')}</Text>
        <Text style={TextStyles.heading2}>{i18nCtx.t('untilThen')}</Text>

        {/*Use empty <Text/>s to add double vertical space where necessary*/}
        <Text />

        <Text style={TextStyles.heading1}>{i18nCtx.t('letsTalk')}</Text>

        <Text />

        <Text style={TextStyles.heading2}>
          {i18nCtx.t('tel')}:{' '}
          <Text
            style={[styles.body, styles.link]}
            onPress={() => Linking.openURL('tel:+18582749673')}
          >
            +1 858.274.9673
          </Text>
        </Text>
        <Text style={TextStyles.heading2}>
          {i18nCtx.t('days')}:{' '}
          <Text style={styles.body}>{i18nCtx.t('hours')}</Text>
        </Text>

        <Text />

        <Text style={TextStyles.heading2}>
          {i18nCtx.t('emailUs')}:{' '}
          <Text
            style={[styles.body, styles.link]}
            onPress={() => Linking.openURL('mailto:info@wordsalive.org')}
          >
            info@wordsalive.org
          </Text>
        </Text>

        <Text />

        <Text style={TextStyles.heading2}>{i18nCtx.t('address')}:</Text>

        {/*We would use separate <Text> tags instead of \n's here, but we want the entire address to be selectable as one element so it can be copied or opened in Maps*/}
        <Text style={styles.body} selectable={true}>
          5111 Santa Fe Street Suite 219{'\n'}San Diego, California, 92109{'\n'}
          United States
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 220,
    height: 150,
  },
  link: {
    color: Colors.link,
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: Colors.orange,
    width: '100%',
    height: '100%',
    paddingLeft: 24,
    paddingRight: 24,
  },
  body: {
    fontSize: 18,
    fontFamily: 'Gotham-Light',
    color: Colors.text,
  },
});
