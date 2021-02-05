export type Book = {
    id: string
    title: string
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
