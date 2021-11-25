import React, { useContext, useEffect, useState } from 'react';
import {
  Linking,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { I18nContext } from '../context/I18nContext';
import { TextStyles } from '../styles/TextStyles';
import { Colors } from '../styles/Colors';
import { ChatAPI } from '../api/ChatAPI';
import { ChatRoom, Message } from '../models/Chat';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { User } from '../models/User';

const chatAPI = new ChatAPI();

type ChatBubbleProps = {
  message: string;
  from: string;
  currentUser: User;
  isFirstInChain: boolean;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  from,
  currentUser,
  isFirstInChain,
}) => {
  return (
    <View>
      {/* Show the volunteers name above the chat bubble */}
      {from !== currentUser.name && isFirstInChain ? (
        <Text style={styles.senderNameText}>{from}</Text>
      ) : null}
      <View
        style={[
          styles.mainChatBubble,
          from === currentUser.name
            ? styles.rightChatBubble
            : styles.leftChatBubble,
        ]}
      >
        <Text
          style={[
            TextStyles.caption2,
            {
              color:
                from === currentUser.name ? Colors.white : Colors.shadowColor,
            },
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
};

/**
 * Left tab on navbar for chatting with volunteers
 */
export const ChatScreen: React.FC = () => {
  const auth = useContext(AuthContext);
  const chatRoomIdKey = `chatRoomId-${auth.user?.id}`;
  const [roomId, setRoomId] = useState<string | null>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [chatRoomData, setChatRoomData] = useState<ChatRoom>();
  const [showMoreHelp, setShowMoreHelp] = useState(false);
  const messagesViewRef = React.useRef(null);
  const i18nCtx = useContext(I18nContext);

  const onMessagesChange = (changedMessages: Message[]): void => {
    setMessages((oldMessages) => [...oldMessages, ...changedMessages]);
  };

  const onRoomDataChange = (room: ChatRoom): void => {
    setChatRoomData(room);
  };

  // Use roomId from previous session if exist
  useEffect(() => {
    AsyncStorage.getItem(chatRoomIdKey).then((id) => setRoomId(id));
  }, []);

  // Subscribe to chat room data changes
  useEffect(() => {
    if (roomId) {
      return chatAPI.listenForRoomDetails(roomId, onRoomDataChange);
    }
  }, [roomId]);

  // Chat room data changed
  useEffect(() => {
    if (chatRoomData) {
      if (messages.length === 0) {
        // Subscribe to new chat messages
        return chatAPI.listenForNewMessages(chatRoomData.id, onMessagesChange);
      }
    }
  }, [chatRoomData]);

  const sendMessage = async (): Promise<void> => {
    let newRoomId = roomId;
    if (auth.user) {
      // Create a new room if no previous roomId OR if current chat is resolved
      if (!newRoomId || (chatRoomData && chatRoomData.resolved)) {
        setMessages([]);
        newRoomId = await chatAPI.createRoom(auth.user);
        setRoomId(newRoomId);
        AsyncStorage.setItem(chatRoomIdKey, newRoomId);
      }
      chatAPI.sendMessage(newRoomId, messageText, auth.user.name);
      setMessageText('');
    }
  };

  return (
    <>
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => setShowMoreHelp(true)}>
            <Text style={TextStyles.heading2}>{i18nCtx.t('needMoreHelp')}</Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <OfflineIndicator style={{ height: '80%' }}>
              <>
                {roomId ? (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    ref={messagesViewRef}
                    onContentSizeChange={() =>
                      messagesViewRef.current?.scrollToEnd({
                        animated: true,
                      })
                    }
                  >
                    {/* Render chat bubbles */}
                    {messages.map(({ id, text, from }, index) => (
                      <ChatBubble
                        key={id}
                        message={text}
                        from={from}
                        currentUser={auth.user}
                        isFirstInChain={
                          index - 1 >= 0 && messages[index - 1].from !== from
                        }
                      />
                    ))}
                    {/* Show conversation resolved text */}
                    {chatRoomData && chatRoomData.resolved ? (
                      <Text style={styles.conversationResolvedText}>
                        {i18nCtx.t('conversationResolved')}
                      </Text>
                    ) : null}
                  </ScrollView>
                ) : null}
                {/* Prompt user to send a message */}
                {!roomId || (chatRoomData && chatRoomData.resolved) ? (
                  <View
                    style={[
                      styles.chatPromptContainer,
                      chatRoomData &&
                        chatRoomData.resolved && { height: '20%' },
                    ]}
                  >
                    <Image
                      style={styles.chatBubbleIcon}
                      source={require('../../assets/images/Chat_bubble.png')}
                    />
                    <Text
                      style={[
                        TextStyles.heading3,
                        { color: Colors.gray, textAlign: 'center' },
                      ]}
                    >
                      {i18nCtx.t('sendUsAMessage')}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.newMessageContainer}>
                  <TextInput
                    value={messageText}
                    onChangeText={setMessageText}
                    style={[styles.messageInput, TextStyles.caption3]}
                    placeholder={i18nCtx.t('enterAMessage')}
                  />
                  <TouchableOpacity
                    onPress={sendMessage}
                    style={styles.sendButtonContainer}
                  >
                    <Image
                      style={styles.sendIcon}
                      source={require('../../assets/images/paper-plane-solid.png')}
                    />
                  </TouchableOpacity>
                </View>
              </>
            </OfflineIndicator>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <MoreHelpPopup visible={showMoreHelp} setVisible={setShowMoreHelp} />
    </>
  );
};

type MoreHelpPopupProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const MoreHelpPopup: React.FC<MoreHelpPopupProps> = ({
  visible,
  setVisible,
}) => {
  const i18nCtx = useContext(I18nContext);
  if (visible)
    return (
      <View style={styles.moreHelpContainer}>
        <Text />

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo-white.png')}
            style={styles.logo}
          />
        </View>
        {/*Use empty <Text/>s to add double vertical space where necessary*/}
        <View>
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
            5111 Santa Fe Street Suite 219{'\n'}San Diego, California, 92109
            {'\n'}
            United States
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={styles.closeButtonContainer}
        >
          <Image
            style={styles.closeButtonIcon}
            source={require('../../assets/images/times-solid.png')}
          />
        </TouchableOpacity>
      </View>
    );
  return null;
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.orange,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  headerContainer: {
    alignItems: 'center',
  },
  chatContainer: {
    paddingHorizontal: 14,
    height: '100%',
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    marginBottom: -36,
  },
  mainChatBubble: {
    borderRadius: 12,
    padding: 18,
    width: '85%',
    marginVertical: 10,
  },
  senderNameText: {
    ...TextStyles.caption3,
    marginLeft: 14,
    marginBottom: -4,
  },
  leftChatBubble: {
    backgroundColor: Colors.mediumGray,
  },
  rightChatBubble: {
    backgroundColor: Colors.orange,
    marginLeft: 'auto',
  },
  messageInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.mediumGray,
    borderRadius: 5,
    padding: 8,
  },
  newMessageContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  conversationResolvedText: {
    ...TextStyles.caption2,
    marginTop: 20,
    color: Colors.orange,
    width: '70%',
    textAlign: 'center',
    alignSelf: 'center',
  },
  sendButtonContainer: {
    height: 38,
    width: 60,
    marginLeft: 8,
    borderRadius: 5,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    tintColor: Colors.white,
    width: 22,
    height: 22,
  },
  chatPromptContainer: {
    alignSelf: 'center',
    height: '80%',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBubbleIcon: {
    marginBottom: 16,
    tintColor: Colors.gray,
    width: 30,
    height: 30,
  },
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
  moreHelpContainer: {
    position: 'absolute',
    justifyContent: 'space-around',
    top: 0,
    bottom: 0,
    alignItems: 'flex-start',
    backgroundColor: Colors.orange,
    width: '100%',
    paddingLeft: 24,
    paddingRight: 24,
  },
  closeButtonContainer: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  closeButtonIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.orange,
  },
  body: {
    fontSize: 18,
    fontFamily: 'Gotham-Light',
    color: Colors.text,
  },
});
