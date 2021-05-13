import React, { useState, useEffect } from 'react';
import { Book, CreateBook, TabContent } from '../models/Book';
import { GeneralPage } from './BookWizard/GeneralPage';
import { TabContentPage } from './BookWizard/TabContentPage';

export const BookWizardPage: React.FC = () => {

  const emptyTabContent: TabContent = {
    body: "",
    video: undefined
  };

  // const [readTabContent, setReadTabContent] =  useState<TabContent | null>(null);
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [image, setImage] = useState<File| null>(null);
  const [readTabContent, setReadTabContent] = useState<TabContent>(emptyTabContent);
  const [exploreTabContent, setExploreTabContent] = useState<TabContent>(emptyTabContent);
  const [learnTabContent, setLearnTabContent] = useState<TabContent>(emptyTabContent);

  const updateReadTabContent = (data: TabContent): void => {
    setReadTabContent(data);
  };

  const updateTitle = (data: string): void => {
    setTitle(data);
  };

  const updateAuthor = (data: string): void => {
    setAuthor(data);
  };

  const updateImage = (data: File | null): void => {
    setImage(data);
  };
  


  return (
    <div>
      {/* <TabContentPage onContentChange= {updateReadTabContent} page={"Read"}>
      </TabContentPage> */}
      <GeneralPage onAuthorChange={updateAuthor} onTitleChange={updateTitle} onImageChange={updateImage}>
      </GeneralPage>
    </div>
  );

};