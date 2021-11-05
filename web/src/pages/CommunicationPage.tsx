import React, { useContext, useEffect, useState } from "react";
import { ChatAPI } from "../api/ChatAPI";
import { AuthContext } from "../context/AuthContext";
import { ChatRoom, Message } from "../models/Chat";

interface ChatProps {
  roomId: string;
}

const chatAPI = new ChatAPI();

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const auth = useContext(AuthContext);

  useEffect(() => {
    const onMessagesChange = (messages: Message[]): void => {
      setMessages(messages);
    };
    const unsubscribe = chatAPI.listenForNewMessages(roomId, onMessagesChange);
    return unsubscribe;
  }, [roomId]);

  const sendMessage = (): void => {
    chatAPI.sendMessage(roomId, messageText, auth.admin?.name || '');
    setMessageText("");
  };

  return (
    <div>
      {messages.map(({ id, text, from, sentAt }) => {
        return (
          <p key={id}>
            {text}, from: {from}
          </p>
        );
      })}
      <input
        type="text"
        value={messageText}
        onChange={(event) => setMessageText(event.target.value)}
      />
      <button onClick={sendMessage}>send</button>
    </div>
  );
};

export const CommunicationPage: React.FC = () => {
  const [currentRoomId, setCurrentRoomId] = useState<string | undefined>();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const onRoomsChange = (rooms: ChatRoom[]): void => {
    setChatRooms(rooms);
    console.log(currentRoomId);
    if (currentRoomId === undefined) {
      setCurrentRoomId(rooms[0].id);
    }
  };

  useEffect(() => {
    chatAPI.listenForNewRooms(onRoomsChange);
  }, []);

  if (currentRoomId)
    return (
      <div>
        <h1>Communication</h1>
        {chatRooms.map(({ id, user }: ChatRoom) => {
          return (
            <p key={id} onClick={() => setCurrentRoomId(id)}>
              {user}
            </p>
          );
        })}
        <h2>chat</h2>
        <Chat roomId={currentRoomId} />
      </div>
    );
  return <div></div>;
};
