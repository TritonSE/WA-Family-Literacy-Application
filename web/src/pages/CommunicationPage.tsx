import React, { useContext, useEffect, useState } from "react";
import { ChatAPI } from "../api/ChatAPI";
import { AuthContext } from "../context/AuthContext";
import { Admin } from "../models/Admin";
import { ChatRoom, Message } from "../models/Chat";
import styles from "./CommunicationPage.module.css";

interface ChatProps {
  roomId: string;
}

const chatAPI = new ChatAPI();

type ChatBubbleProps = {
  message: string;
  from: string;
  currentUser: Admin | null;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  from,
  currentUser,
}) => {
  if (currentUser)
    return (
      <div>
        <div
          className={[
            styles.mainChatBubble,
            from === currentUser.name
              ? styles.rightChatBubble
              : styles.leftChatBubble,
          ].join(" ")}
        >
          <p className="caption2">{message}</p>
        </div>
      </div>
    );
  return null;
};

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const auth = useContext(AuthContext);

  const onMessagesChange = (changedMessages: Message[]): void => {
    setMessages((oldMessages) => [...oldMessages, ...changedMessages]);
  };

  // Listen for new messages in currently selected chat room
  useEffect(() => {
    setMessages([]);
    return chatAPI.listenForNewMessages(roomId, onMessagesChange);
  }, [roomId]);

  const sendMessage = (): void => {
    chatAPI.sendMessage(roomId, messageText, auth.admin?.name || "");
    setMessageText("");
  };

  const resolveChat = (): void => {
    chatAPI.resolveChat(roomId);
  };

  return (
    <div>
      {messages.map(({ id, text, from }) => {
        return (
          <ChatBubble
            key={id}
            message={text}
            from={from}
            currentUser={auth.admin}
          />
        );
      })}
      <input
        type="text"
        value={messageText}
        onChange={(event) => setMessageText(event.target.value)}
      />
      <button onClick={sendMessage}>send</button>
      <button onClick={resolveChat}>resolve</button>
    </div>
  );
};

export const CommunicationPage: React.FC = () => {
  const [currentRoomId, setCurrentRoomId] = useState<string | undefined>();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const onNewRooms = (newRooms: ChatRoom[]): void => {
    setChatRooms((oldRooms) => [...newRooms, ...oldRooms]);
  };

  // Automatically select first chat room if none is selected
  useEffect(() => {
    if (!currentRoomId && chatRooms.length > 0)
      setCurrentRoomId(chatRooms[0].id);
  }, [chatRooms]);

  // Listen for newly created chat rooms in real time
  useEffect(() => {
    return chatAPI.listenForNewRooms(onNewRooms);
  }, []);
  return (
    <div>
      {chatRooms.map(({ id, user }: ChatRoom) => {
        return (
          <p key={id} onClick={() => setCurrentRoomId(id)}>
            {user}
          </p>
        );
      })}
      <div className={styles.titleBar}>
        <h1>Chat</h1>
      </div>
      <div className={styles.chatWindowContainer}>
        <div className={styles.sideBar}>sideBar</div>
        <div className={styles.chatWindow}>
          {currentRoomId && <Chat roomId={currentRoomId} />}
        </div>
      </div>
    </div>
  );
};
