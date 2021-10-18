import { Language } from './Languages';

export type Book = {
  id: string
  title: string
  author: string
  image?: string
  languages: Language[]
  created_at: string
};

export type BookUpdate = {
  title?: string;
  author?: string;
};

export type BookDetails = {
  id: string
  title: string
  author: string
  image?: string
  read: TabContent
  explore: TabContent
  learn: TabContent
  created_at: string
};

export type TabContent = {
  video?: string;
  body: string;
};

// Nullable TabContent
export type TabContentUpdate = { [K in keyof TabContent]: TabContent[K] | undefined };
