import firebase from 'firebase/app';
import 'firebase/firestore';
import { ChatRoom, Message } from '../models/Chat';

// Class to encapsulate Chat functionality for admins
class ChatAPI {
  chatRoomsCollection: firebase.firestore.DocumentData;

  constructor() {
    const fbConfig = process.env.REACT_APP_FB_CONFIG ? JSON.parse(process.env.REACT_APP_FB_CONFIG) : {
      apiKey: process.env.REACT_APP_FB_API_KEY || 'AIzaSyBSJHJ-VfdN2Y3wC_vfD1k6bEU2mQmP-Vg',
      authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN || 'words-alive-staging.firebaseapp.com',
      projectId: process.env.REACT_APP_FB_PROJECT_ID || 'words-alive-staging',
      appId: process.env.REACT_APP_FB_APP_ID || '1:1534285739:web:2bada99614d9126d7224ee',
    };
    const app = firebase.apps[0] || firebase.initializeApp(fbConfig);
    const db = app.firestore();
    this.chatRoomsCollection = db.collection('chatRooms');
  }

  listenForNewRooms(callback: (newRooms: ChatRoom[]) => void): () => void {
    const unsubscribe = this.chatRoomsCollection
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const rooms: ChatRoom[] = [];
        querySnapshot.docChanges().forEach(({type, doc}: firebase.firestore.DocumentChange) => {
          if (type == 'added')
            rooms.push({ ...doc.data() as ChatRoom, id: doc.id });
        });
        callback(rooms);
      });
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
          messages.push({ ...doc.data() as Message, id: doc.id });
        });
        callback(messages);
      });
    return unsubscribe;
  }

  sendMessage(roomId: string, text: string, from: string): void {
    const room = this.chatRoomsCollection.doc(roomId);
    room.collection("messages").add({
      text,
      from,
      sentAt: new Date().toUTCString(),
    });
  }
}

export { ChatAPI };
