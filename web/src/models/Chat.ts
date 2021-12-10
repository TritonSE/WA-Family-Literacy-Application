export type ChatRoom = {
  id: string;
  resolved: boolean;
  messages: Message[];
  user: string;
  createdAt: Date;
};

export type Message = {
  id: string;
  text: string;
  from: string;
  sentAt: Date;
};
