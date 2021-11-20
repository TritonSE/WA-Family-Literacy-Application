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
} from "react-native";
import { I18nContext } from '../context/I18nContext';
import { TextStyles } from '../styles/TextStyles';
import { Colors } from '../styles/Colors';
import { ChatAPI } from '../api/ChatAPI';
import { ChatRoom, Message } from '../models/Chat';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const chatAPI = new ChatAPI();

/**
 * Left tab on navbar for chatting with volunteers
 */
export const ChatScreen: React.FC = () => {
  const auth = useContext(AuthContext);
  const [roomId, setRoomId] = useState<string | null>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [chatRoomData, setChatRoomData] = useState<ChatRoom>();
  const [showMoreHelp, setShowMoreHelp] = useState(false);
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
        setRoomId(null);
      } else if (messages.length === 0) {
        // Subscribe to new chat messages
        return chatAPI.listenForNewMessages(id, onMessagesChange);
      }
    }
  }, [chatRoomData]);

  const sendMessage = async (): Promise<void> => {
    let newRoomId = roomId;
    if (!newRoomId && auth.user) {
      // Create a new room if no previous roomId
      newRoomId = await chatAPI.createRoom(auth.user);
      setRoomId(newRoomId);
      AsyncStorage.setItem('chatRoomId', newRoomId);
    }
    if (newRoomId && auth.user) {
      chatAPI.sendMessage(newRoomId, messageText, auth.user?.name);
      setMessageText('');
    }
  };

  const rateChat = (): void => {
    if (roomId) chatAPI.rateChat(roomId, 4);
  };

  return (
    <SafeAreaView style={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setShowMoreHelp(true)}>
          <Text style={TextStyles.heading2}>{i18nCtx.t("needMoreHelp")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chatContainer}>
        <ScrollView>
          {messages.map(({ id, text, from }) => {
            
            return (
              <Text key={id}>
                {text}, from: {from}
              </Text>
            );
          })}
        </ScrollView>

        {!roomId && (
          <Text>Have any questions or concerns? Send us a message.</Text>
        )}
        {chatRoomData && chatRoomData.resolved && !chatRoomData.rating && (
          <TouchableOpacity onPress={rateChat}>
            <Text>Leave a rating.</Text>
          </TouchableOpacity>
        )}
        <View style={styles.newMessageContainer}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            style={[styles.messageInput, TextStyles.caption3]}
            placeholder="Enter a message"
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={styles.sendButtonContainer}
          >
            <Image
              style={styles.sendIcon}
              source={require("../../assets/images/paper-plane-solid.png")}
            />
          </TouchableOpacity>
        </View>
      </View>

      {showMoreHelp ? (
        <View style={styles.moreHelpContainer}>
          <Text />

          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo-white.png")}
              style={styles.logo}
            />
          </View>
          {/*Use empty <Text/>s to add double vertical space where necessary*/}
          <View>
            <Text style={TextStyles.heading1}>{i18nCtx.t("letsTalk")}</Text>

            <Text />

            <Text style={TextStyles.heading2}>
              {i18nCtx.t("tel")}:{" "}
              <Text
                style={[styles.body, styles.link]}
                onPress={() => Linking.openURL("tel:+18582749673")}
              >
                +1 858.274.9673
              </Text>
            </Text>
            <Text style={TextStyles.heading2}>
              {i18nCtx.t("days")}:{" "}
              <Text style={styles.body}>{i18nCtx.t("hours")}</Text>
            </Text>

            <Text />

            <Text style={TextStyles.heading2}>
              {i18nCtx.t("emailUs")}:{" "}
              <Text
                style={[styles.body, styles.link]}
                onPress={() => Linking.openURL("mailto:info@wordsalive.org")}
              >
                info@wordsalive.org
              </Text>
            </Text>

            <Text />

            <Text style={TextStyles.heading2}>{i18nCtx.t("address")}:</Text>

            {/*We would use separate <Text> tags instead of \n's here, but we want the entire address to be selectable as one element so it can be copied or opened in Maps*/}
            <Text style={styles.body} selectable={true}>
              5111 Santa Fe Street Suite 219{"\n"}San Diego, California, 92109
              {"\n"}
              United States
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowMoreHelp(false)}
            style={styles.closeButtonContainer}
          >
            <Image
              style={styles.closeButtonIcon}
              source={require("../../assets/images/times-solid.png")}
            />
          </TouchableOpacity>
        </View>
      ) : (
        null
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.orange,
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  headerContainer: {
    alignItems: "center",
  },
  chatContainer: {
    height: "100%",
    backgroundColor: Colors.white,
    justifyContent: "space-between",
    marginBottom: -36,
  },
  leftChatBubble: {
    backgroundColor: Colors.lightGray,
    padding: 8,
  },
  rightChatBubble: {
    backgroundColor: Colors.orange,
    padding: 8,
  },
  messageInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderRadius: 5,
    padding: 8,
    marginBottom: 20,
  },
  newMessageContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  sendButtonContainer: {
    height: 38,
    width: 60,
    marginLeft: 8,
    borderRadius: 5,
    backgroundColor: Colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: {
    tintColor: Colors.white,
    width: 22,
    height: 22,
  },
  logoContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    width: 220,
    height: 150,
  },
  link: {
    color: Colors.link,
    textDecorationLine: "underline",
  },
  moreHelpContainer: {
    position: "absolute",
    justifyContent: "space-around",
    top: 0,
    bottom: 0,
    alignItems: "flex-start",
    backgroundColor: Colors.orange,
    width: "100%",
    paddingLeft: 24,
    paddingRight: 24,
  },
  closeButtonContainer: {
    alignSelf: "center",
    width: 40,
    height: 40,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  closeButtonIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.orange,
  },
  body: {
    fontSize: 18,
    fontFamily: "Gotham-Light",
    color: Colors.text,
  },
});
