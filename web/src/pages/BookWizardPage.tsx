import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router';
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

  const submitPage = async (): Promise<void> => {
    const imageAPI = new ImageAPI(process.env.REACT_APP_BASE_URL || 'http://localhost:8080');
    // image will never equal null here - done to please Typescript type checking
    if (image != null) {
      const imageType = image.type;
      const imageData = await image.arrayBuffer();
      const imageURl = await imageAPI.uploadImage(new Uint8Array(imageData), imageType);
      const uploadedBook = await client.uploadBook(title, author, imageURl);
      await client.uploadBookDetails(uploadedBook.id, "en", readTabContent, exploreTabContent, learnTabContent);
      setRedirect(true);
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
        return readTabContent.body != "";
      case 2:
        return exploreTabContent.body != "";
      case 3:
        return learnTabContent.body != "";
    }
    return true;
  };

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [image, setImage] = useState<File| null>(null);
  const [readTabContent, setReadTabContent] = useState<TabContent>(emptyTabContent);
  const [exploreTabContent, setExploreTabContent] = useState<TabContent>(emptyTabContent);
  const [learnTabContent, setLearnTabContent] = useState<TabContent>(emptyTabContent);
  
  // controls wheter to redirect the page back to start
  const [redirect, setRedirect] = useState<boolean>(false);
  const generalDone = title !== '' && author !== '' && image != null;
  const readDone = readTabContent.body !== '';
  const exploreDone = exploreTabContent.body !== '';
  const learnDone = learnTabContent.body !== '';

  const pages = [
    <GeneralPage key={0} onTitleChange={setTitle} onAuthorChange={setAuthor} onImageChange={setImage} 
      image={image} title={title} author={author}></GeneralPage>,
    <TabContentPage onContentChange={setReadTabContent} key={1} currentContent={readTabContent}></TabContentPage>,
    <TabContentPage onContentChange={setExploreTabContent} currentContent={exploreTabContent} key={2}></TabContentPage>,
    <TabContentPage onContentChange={setLearnTabContent} currentContent={learnTabContent} key={3}></TabContentPage>,
    <OverviewPage onSubmit={submitPage} key={4}></OverviewPage>
  ];

  return (
    <div>
      { redirect ? <Redirect to="upload"/> :
        <div>
          <UploadBooksNavigation pageNumber={currentPage} pageChange={changePage} 
            allowContinue={allowChangePage()} pageStatus={[generalDone, readDone, exploreDone, learnDone, false]}></UploadBooksNavigation>
          { pages[currentPage]} 
        </div> }
    </div>
  );

};