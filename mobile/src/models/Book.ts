import { Language } from './Languages';

export type Book = {
    id: string
    title: string
    author: string
    image?: string
    languages: Language[]
    createdAt: string
};

export type BookDetails = {
    id: string
    title: string
    author: string
    image?: string
    read?: TabContent
    explore?: TabContent
    learn?: TabContent
    createdAt: string
};

type TabContent = {
    video?: string;
    body: string;
};
