export type ChatRoom = {
  id: string;
  resolved: boolean;
  messages: Message[];
  user: string;
  rating: number;
  createdAt: Date;
};

export type Message = {
  id: string;
  text: string;
  from: string;
  sentAt: Date;
};
