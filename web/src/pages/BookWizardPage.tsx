import React, { useState, useContext } from 'react';
import { ImageAPI } from '../api/ImageAPI';
import { UploadBooksNavigation } from '../components/UploadBooksNavigation';
import { APIContext } from '../context/APIContext';
import { TabContent } from '../models/Book';
import { GeneralPage } from './BookWizard/GeneralPage';
import { OverviewPage } from './BookWizard/OverviewPage';
import { TabContentPage } from './BookWizard/TabContentPage';

export const BookWizardPage: React.FC = () => {

  const client = useContext(APIContext);

  const emptyTabContent: TabContent = {
    body: "",
    video: undefined
  };

  const submitPage = async (): Promise<string> => {
    const imageAPI = new ImageAPI(process.env.REACT_APP_BASE_URL || 'http://localhost:8080');
    
    
    if (image != null) {
      const imageType = image.type;
      const imageData = await image.arrayBuffer();
      const imageURl = await imageAPI.uploadImage(new Uint8Array(imageData), imageType);
      const uploadedBook = await client.uploadBook(title, author, imageURl);
      const uploadedBookDetails = await client.uploadBookDetails(uploadedBook.id, "en", readTabContent, exploreTabContent, learnTabContent);
      return "Success";
    }

    throw "Fail";
  };

  const changePage = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const allowChangePage = (): boolean => {
    switch(currentPage) {
      case 0:
        return title != "" && author != "" && image != null;
      case 1:
        return readTabContent.body != "";
      case 2:
        return exploreTabContent.body != "";
      case 3:
        return learnTabContent.body != "";
    }
    return true;
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
    <GeneralPage key={0} onTitleChange={setTitle} onAuthorChange={setAuthor} onImageChange={setImage} currentImage={image} currentTitle={title} currentAuthor={author}></GeneralPage>,
    <TabContentPage onContentChange={setReadTabContent} key={1} currentContent={readTabContent}></TabContentPage>,
    <TabContentPage onContentChange={setExploreTabContent} currentContent={exploreTabContent} key={2}></TabContentPage>,
    <TabContentPage onContentChange={setLearnTabContent} currentContent={learnTabContent} key={3}></TabContentPage>,
    <OverviewPage onSubmit={submitPage} key={4}></OverviewPage>
  ];




  


  return (
    <div>
      <UploadBooksNavigation pageNumber={currentPage} pageChange={changePage} allowContinue={allowChangePage()}></UploadBooksNavigation>
      {pages[currentPage]}
    </div>
  );

};