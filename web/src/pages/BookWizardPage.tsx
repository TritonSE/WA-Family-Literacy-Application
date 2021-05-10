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

  // const [readTabContent, setReadTabContent] =  useState<TabContent | null>(null);

  const [newBook, setNewBook] = useState<CreateBook>(emptyBook);
  useEffect(() => {
    console.log(newBook);
  }, [newBook]);
  


  const setReadTabContent = ( data: TabContent): void => {
    setNewBook(newBook => ({
      ...newBook, read:data
    }));
  };


  return (
    <div>
      <TabContentPage onContentChange= {setReadTabContent}>
      </TabContentPage>
    </div>
  );

};