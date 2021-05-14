import React, { useState, useEffect } from 'react';
import { ImageAPI } from '../api/ImageAPI';
import { UploadBooksNavigation } from '../components/UploadBooksNavigation';
import { Book, CreateBook, TabContent } from '../models/Book';
import { GeneralPage } from './BookWizard/GeneralPage';
import { OverviewPage } from './BookWizard/OverviewPage';
import { TabContentPage } from './BookWizard/TabContentPage';

export const BookWizardPage: React.FC = () => {

  const emptyTabContent: TabContent = {
    body: "",
    video: undefined
  };

  const submitPage = (): void => {
    console.log("Hello");
  };

  const changePage = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  // const [readTabContent, setReadTabContent] =  useState<TabContent | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [image, setImage] = useState<File| null>(null);
  const [readTabContent, setReadTabContent] = useState<TabContent>(emptyTabContent);
  const [exploreTabContent, setExploreTabContent] = useState<TabContent>(emptyTabContent);
  const [learnTabContent, setLearnTabContent] = useState<TabContent>(emptyTabContent);

  const pages = [
    <GeneralPage key={0} onTitleChange={setTitle} onAuthorChange={setAuthor} onImageChange={setImage}></GeneralPage>,
    <TabContentPage onContentChange={setReadTabContent} key={1}></TabContentPage>,
    <TabContentPage onContentChange={setExploreTabContent} key={2}></TabContentPage>,
    <TabContentPage onContentChange={setLearnTabContent} key={3}></TabContentPage>,
    <OverviewPage onSubmit={submitPage} key={4}></OverviewPage>
  ];




  


  return (
    <div>
      <UploadBooksNavigation pageNumber={currentPage} pageChange={changePage}></UploadBooksNavigation>
      {pages[currentPage]}
      {/* <TabContentPage onContentChange= {setReadTabContent} page={"Read"}>
      </TabContentPage> */}
      {/* <GeneralPage onAuthorChange={updateAuthor} onTitleChange={updateTitle} onImageChange={updateImage}>
      </GeneralPage> */}
      {/* <OverviewPage onSubmit={submitBook}></OverviewPage> */}
    </div>
  );

};