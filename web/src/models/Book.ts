import { Language } from "./Languages";

export type Book = {
  id: string
  title: string
  author: string
  image?: string
  languages: Language[]
  created_at: string
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

export type CreateBook = {
  title: string
  author: string
  image: Int8Array
  read: TabContent
  explore: TabContent
  learn: TabContent
};