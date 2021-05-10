import React, { useState, useEffect } from 'react';
import { Book, CreateBook, TabContent } from '../models/Book';
import { TabContentPage } from './BookWizard/TabContentPage';

export const BookWizardPage: React.FC = () => {
  const emptyBook: CreateBook = {
    title: "",
    author: "",
    image: new Int8Array(), 
    read: {
      body: "",
      video: ""
    },
    explore: {
      body: "",
      video: ""
    },
    learn: {
      body: "",
      video: ""
    },
  };

  const emptyTabContent: TabContent = {
    body: "",
    video: undefined
  };

  // const [readTabContent, setReadTabContent] =  useState<TabContent | null>(null);
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [readTabContent, setReadTabContent] = useState<TabContent>(emptyTabContent);
  const [exploreTabContent, setExploreTabContent] = useState<TabContent>(emptyTabContent);
  const [learnTabContent, setLearnTabContent] = useState<TabContent>(emptyTabContent);

  const [newBook, setNewBook] = useState<CreateBook>(emptyBook);
  useEffect(() => {
    console.log(readTabContent);
  }, [readTabContent]);

  const updateReadTabContent = (data: TabContent): void => {
    setReadTabContent(data);
  };
  


  const setReadTabContent1 = ( data: TabContent): void => {
    setNewBook(newBook => ({
      ...newBook, read:data
    }));
  };


  return (
    <div>
      <TabContentPage onContentChange= {updateReadTabContent}>
      </TabContentPage>
    </div>
  );

};