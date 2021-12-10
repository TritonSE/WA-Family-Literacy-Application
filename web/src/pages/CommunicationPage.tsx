import React, { FormEvent, useContext, useEffect, useState } from "react";
import { ChatAPI } from "../api/ChatAPI";
import { AuthContext } from "../context/AuthContext";
import { Admin } from "../models/Admin";
import { ChatRoom, Message } from "../models/Chat";
import styles from "./CommunicationPage.module.css";
import SendButtonImage from "../assets/images/paper-plane-regular.svg";

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
      <div
        className={[
          styles.mainChatBubble,
          from === currentUser.name
            ? styles.rightChatBubble
            : styles.leftChatBubble,
        ].join(" ")}
      >
        {message}
      </div>
    );
  return null;
};

interface ChatProps {
  roomId?: string;
}

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const [chatRoomData, setChatRoomData] = useState<ChatRoom>();
  const messagesEndRef = React.createRef<HTMLDivElement>();
  const auth = useContext(AuthContext);

  const onMessagesChange = (changedMessages: Message[]): void => {
    setMessages((oldMessages) => [...oldMessages, ...changedMessages]);
  };

  const onRoomDataChange = (room: ChatRoom): void => {
    setChatRoomData(room);
  };

  // Subscribe to chat room data changes
  useEffect(() => {
    if (roomId) {
      return chatAPI.listenForRoomDetails(roomId, onRoomDataChange);
    }
  }, [roomId]);

  // Listen for new messages in currently selected chat room
  useEffect(() => {
    if (roomId) {
      setMessages([]);
      return chatAPI.listenForNewMessages(roomId, onMessagesChange);
    }
  }, [roomId]);

  // Scroll new messages into view when they come in
  useEffect(() => {
    if (messages.length > 0 || chatRoomData?.resolved)
      messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatRoomData]);

  const sendMessage = (event: FormEvent): void => {
    event.preventDefault();
    if (roomId) {
      chatAPI.sendMessage(roomId, messageText, auth.admin?.name || "");
      setMessageText("");
    }
  };

  const resolveChat = (): void => {
    if (roomId) chatAPI.resolveChat(roomId);
  };

  return (
    <>
      <div className={styles.titleBar}>
        <div className={styles.chatDetails}>
          <h3 className="h3">Chat</h3>
          {chatRoomData && (
            <span className="body3">
              You&apos;re Chatting with {chatRoomData?.user}
            </span>
          )}
        </div>
        {chatRoomData && (
          <button
            className={styles.resolveButton}
            onClick={resolveChat}
            disabled={chatRoomData?.resolved}
          >
            Question Resolved
          </button>
        )}
      </div>
      <div className={styles.messagesContainer}>
        {chatRoomData ? (
          <>
            <div className={styles.messagesView}>
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
              {chatRoomData?.resolved && (
                <div className={styles.chatEndedText}>
                  Your conversation has ended.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className={styles.newMessageContainer}>
              <input
                className={styles.messageInput}
                type="text"
                placeholder="Message here..."
                value={messageText}
                disabled={chatRoomData?.resolved}
                onChange={(event) => setMessageText(event.target.value)}
              />
              {!chatRoomData?.resolved && (
                <input
                  type="image"
                  className={styles.sendButton}
                  src={SendButtonImage}
                  width={26}
                />
              )}
            </form>
          </>
        ) : (
          <div className={styles.chatPrompt}>
            <img src="./img/logo.png" alt="Logo" width={400} />
            <span className="body3">Click a message to begin chatting</span>
          </div>
        )}
      </div>
    </>
  );
};

export const CommunicationPage: React.FC = () => {
  const [currentRoomId, setCurrentRoomId] = useState<string | undefined>();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const onNewRooms = (newRooms: ChatRoom[]): void => {
    setChatRooms((oldRooms) => [...newRooms, ...oldRooms]);
  };

  // Listen for newly created chat rooms in real time
  useEffect(() => {
    return chatAPI.listenForNewRooms(onNewRooms);
  }, []);

  const sideBarList = chatRooms.map((chatRoom) =>
    <li className={styles.sideBarElement}>{chatRoom.user}</li>
  );

  return (
    <div className={styles.chatWindowContainer}>
      <div className={styles.sideBar}>
        {chatRooms.map(({ id, user }: ChatRoom) => {
          return (
            <p key={id} onClick={() => setCurrentRoomId(id)}>
              {user}
            </p>
          );
        })}
      </div>
      <div className={styles.chatWindow}>
        <Chat roomId={currentRoomId} />
      </div>
    </div>
  );
};
