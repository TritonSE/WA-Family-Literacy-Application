export type Book = {
    id: string
    title: string
    author: string
    image?: string
    read?: TabContent
    explore?: TabContent
    learn?: TabContent
    createdAt: string
    languages: string[]
};

type TabContent = {
    video?: string;
    body: string;
};
