import Constants from 'expo-constants';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { ChatRoom, Message } from '../models/Chat';
import { User } from '../models/User';

// Class to encapsulate Chat functionality
class ChatAPI {
  chatRoomsCollection: firebase.firestore.DocumentData;

  constructor() {
    const app = firebase.apps[0] || firebase.initializeApp(Constants.manifest?.extra?.firebase);
    const db = app.firestore();
    this.chatRoomsCollection = db.collection('chatRooms');
  }

  listenForRoomDetails(roomId: string, callback: (room: ChatRoom) => void): void{
    const unsubscribe = this.chatRoomsCollection.doc(roomId).onSnapshot((doc: firebase.firestore.DocumentSnapshot) => callback({id: doc.id, ...doc.data()} as ChatRoom));
    return unsubscribe;
  }

  // Listen for new messages in a chat room (calling this will initially return the current messages)
  listenForNewMessages(roomId: string, callback: (changedMessages: Message[]) => void): () => void {
    const room = this.chatRoomsCollection.doc(roomId);
    const unsubscribe = room
      .collection('messages')
      .orderBy('sentAt')
      .onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const messages: Message[] = [];
        querySnapshot.docChanges().forEach(({ doc }: firebase.firestore.DocumentChange) => {
          messages.push({ ...doc.data(), id: doc.id } as Message);
        });
        callback(messages);
      });
    return unsubscribe;
  }

  async createRoom(user: User): Promise<string> {
    const room = await this.chatRoomsCollection.add({
      user: user.name,
      userId: user.id,
      resolved: false,
      createdAt: new Date().toUTCString(),
    });
    return room.id;
  }

  sendMessage(roomId: string, text: string, from: string): void {
    const room = this.chatRoomsCollection.doc(roomId);
    room.collection("messages").add({
      text,
      from,
      sentAt: Date.now(),
    });
  }
}

export { ChatAPI };
