import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { ImageAPI } from '../api/ImageAPI';
import { UploadBooksNavigation } from '../components/UploadBooksNavigation';
import { APIContext } from '../context/APIContext';
import { TabContent } from '../models/Book';
import { GeneralPage } from './BookWizard/GeneralPage';
import { OverviewPage } from './BookWizard/OverviewPage';
import { TabContentPage } from './BookWizard/TabContentPage';
import { Language } from '../models/Languages';

export const BookWizardPage: React.FC = () => {

  const client = useContext(APIContext);
  const history = useHistory();

  const emptyTabContent: TabContent = {
    body: "",
    video: undefined
  };

  const emptyMap: Map<Language, TabContent> = new Map();

  const submitPage = async (): Promise<void> => {
    const imageAPI = new ImageAPI(process.env.REACT_APP_BASE_URL || 'http://localhost:8080');
    // image will never equal null here - done to please Typescript type checking
    if (image != null) {
      const imageType = image.type;
      const imageData = await image.arrayBuffer();
      const imageURl = await imageAPI.uploadImage(new Uint8Array(imageData), imageType);
      const uploadedBook = await client.uploadBook(title, author, imageURl);
      // await client.uploadBookDetails(uploadedBook.id, "en", readTabContent, exploreTabContent, learnTabContent);
      history.push("/books");
      return;
    }
  };

  const changePage = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  // logic to allow if the user can move onto the next page
  const allowChangePage = (): boolean => {
    switch(currentPage) {
      case 0:
        return title != "" && author != "" && image != null;
      case 1:
        return (readTabContent.get(language)?? emptyTabContent).body !== "";
      case 2:
        return (exploreTabContent.get(language)?? emptyTabContent).body !== "";
      case 3:
        return (learnTabContent.get(language)?? emptyTabContent).body !== "";
    }
    return true;
  };

  const handleReadTabContentChange = (content: TabContent): void => {
    setReadTabContent((prevState) => new Map<Language, TabContent>(prevState).set(language, content));
  };

  const handleExploreTabContentChange = (content: TabContent): void => {
    setExploreTabContent((prevState) => new Map<Language, TabContent>(prevState).set(language, content));
  };

  const handleLearnTabContentChange = (content: TabContent): void => {
    setLearnTabContent((prevState) => new Map<Language, TabContent>(prevState).set(language, content));
  };

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [image, setImage] = useState<File| null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [readTabContent, setReadTabContent] = useState<Map<Language, TabContent>>(emptyMap);
  const [exploreTabContent, setExploreTabContent] = useState<Map<Language, TabContent>>(emptyMap);
  const [learnTabContent, setLearnTabContent] = useState<Map<Language, TabContent>>(emptyMap);
  
  // controls wheter to redirect the page back to start
  const generalDone = title !== '' && author !== '' && image != null;
  const readDone = (readTabContent.get(language)?? emptyTabContent).body !== "";
  const exploreDone = (exploreTabContent.get(language)?? emptyTabContent).body !== "";
  const learnDone = (learnTabContent.get(language)?? emptyTabContent).body !== "";

  const pages = [
    <GeneralPage key={0} onTitleChange={setTitle} onAuthorChange={setAuthor} onImageChange={setImage} 
      image={image} title={title} author={author}></GeneralPage>,
    <TabContentPage onContentChange={handleReadTabContentChange} key={1} 
      currentContent={readTabContent.get(language) || emptyTabContent} language={language}></TabContentPage>,
    <TabContentPage onContentChange={handleExploreTabContentChange} 
      currentContent={exploreTabContent.get(language) || emptyTabContent} language={language} key={2}></TabContentPage>,
    <TabContentPage onContentChange={handleLearnTabContentChange} language={language} currentContent={learnTabContent.get(language) || emptyTabContent} key={3}></TabContentPage>,
    <OverviewPage onSubmit={submitPage} key={4}></OverviewPage>
  ];

  return (
    <div>
      <UploadBooksNavigation pageNumber={currentPage} changePage={changePage} 
        allowContinue={allowChangePage()} pageStatus={[generalDone, readDone, exploreDone, learnDone, false]} 
        changeLanguage={setLanguage} currentLanguage={language}></UploadBooksNavigation>
      { pages[currentPage]}
    </div>
  );

};