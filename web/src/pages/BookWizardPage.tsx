import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { ImageAPI } from '../api/ImageAPI';
import { UploadBooksNavigation } from '../components/UploadBooksNavigation';
import { APIContext } from '../context/APIContext';
import { Book, BookDetails, TabContent } from '../models/Book';
import { GeneralPage } from './BookWizard/GeneralPage';
import { OverviewPage } from './BookWizard/OverviewPage';
import { TabContentPage } from './BookWizard/TabContentPage';
import { Language, LanguageLabels } from '../models/Languages';
import axios from 'axios';

type BookWizardPageParams = {
  id: string | undefined,
};

export const BookWizardPage: React.FC = () => {
  const client = useContext(APIContext);
  const history = useHistory();

  const emptyTabContent: TabContent = {
    body: "",
    video: undefined
  };

  const emptyMap: Map<Language, TabContent> = new Map();

  const changePage = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  const isTabContentDone = (tabContent: TabContent | undefined): boolean => {
    if (tabContent == undefined) return false;
    return tabContent.body !== "";
  };

  // logic to allow if the user can move onto the next page
  const allowChangePage = (): boolean => {
    switch(currentPage) {
      case 0:
        return title != "" && author != "" && image != null;
      case 1:
        return isTabContentDone(readTabContent.get(language));
      case 2:
        return isTabContentDone(exploreTabContent.get(language));
      case 3:
        return isTabContentDone(learnTabContent.get(language));
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

  const { id } = useParams<BookWizardPageParams>();

  const submitPage = async ( uploadLanguage: Map<Language, boolean> ): Promise<void> => {
    const languagesToUpload =  Array.from(uploadLanguage)
      .filter( ([, shouldUpload]) => shouldUpload)
      .map( ([language]) => language);

    if (id !== undefined) {
      try {
        await client.updateBook(id, { title, author });
        await Promise.all(languagesToUpload.map(lang => client.updateBookDetails(id, lang,
          readTabContent.get(lang) as TabContent,
          exploreTabContent.get(lang) as TabContent,
          learnTabContent.get(lang) as TabContent)));

        history.push('/books');
        return;
      } catch (e) {
        alert(`Unable to update book: ${e.message}`);
      }
    } else {
      try {
        const imageAPI = new ImageAPI(process.env.REACT_APP_BASE_URL || 'http://localhost:8080');
        // image will never equal null here - done to please Typescript type checking
        if (image != null) {
          const imageType = image.type;
          const imageData = await image.arrayBuffer();
          const imageURl = await imageAPI.uploadImage(new Uint8Array(imageData), imageType);
          const uploadedBook = await client.uploadBook(title, author, imageURl);
          await Promise.all(languagesToUpload.map(lang => client.uploadBookDetails(uploadedBook.id, lang,
            readTabContent.get(lang) as TabContent,
            exploreTabContent.get(lang) as TabContent,
            learnTabContent.get(lang) as TabContent)));
        }
        history.push('/books');
        return;
      }
      catch (e) {
        alert(`Unable to Upload Book: ${e.message}`);
      }
    }
  };

  // Fetch existing book if editing
  useEffect(() => {
    (async () => {
      if (id) {
        let book: Book;
        const bookDetails = new Map<Language, BookDetails>();

        try {
          book = await client.getBook(id);

          await Promise.all(
            book.languages.map(lang => client.getBookDetails(id, lang).then(details => {
              bookDetails.set(lang, details);
            }))
          );
        } catch (e) {
          // navigate back to book list if request fails (book not found?)
          history.push("/books");
          return;
        }

        if (book.image) {
          const imageRes = await axios.get(book.image, { responseType: 'blob' });
          const file = new File([imageRes.data], '');
          setImage(file);
        }

        setTitle(book.title);
        setAuthor(book.author);
        setLanguage(book.languages[0]);

        const read = new Map<Language, TabContent>();
        const explore = new Map<Language, TabContent>();
        const learn = new Map<Language, TabContent>();

        for (const [lang, details] of bookDetails.entries()) {
          read.set(lang, details.read);
          explore.set(lang, details.explore);
          learn.set(lang, details.learn);
        }

        setReadTabContent(read);
        setExploreTabContent(explore);
        setLearnTabContent(learn);
      }
    })();
  }, []);

  // controls wheter to redirect the page back to start
  const generalDone = title !== '' && author !== '' && image != null;
  const readDone = isTabContentDone(readTabContent.get(language));
  const exploreDone = isTabContentDone(exploreTabContent.get(language));
  const learnDone = isTabContentDone(learnTabContent.get(language));

  // array of languages that are finishd and can be uploaded
  const doneLanguageArray: Language[] = ((Object.keys(LanguageLabels)) as Language[])
    .filter( (language) =>
      isTabContentDone(readTabContent.get(language)) &&
      isTabContentDone(exploreTabContent.get(language)) &&
      isTabContentDone(learnTabContent.get(language)));

  // set of languages that have been started by the user
  const startedLanguages: Set<Language> = new Set(((Object.keys(LanguageLabels)) as Language[])
    .filter((language) =>
      readTabContent.get(language) != undefined ||
      exploreTabContent.get(language) != undefined ||
      learnTabContent.get(language) != undefined));

  const pages = [
    <GeneralPage key={0} onTitleChange={setTitle} onAuthorChange={setAuthor} onImageChange={setImage}
      image={image} title={title} author={author}></GeneralPage>,
    <TabContentPage onContentChange={handleReadTabContentChange} key={1}
      currentContent={readTabContent.get(language) || emptyTabContent} language={language}></TabContentPage>,
    <TabContentPage onContentChange={handleExploreTabContentChange}
      currentContent={exploreTabContent.get(language) || emptyTabContent} language={language} key={2}></TabContentPage>,
    <TabContentPage onContentChange={handleLearnTabContentChange} language={language} currentContent={learnTabContent.get(language) || emptyTabContent} key={3}></TabContentPage>,
    <OverviewPage onSubmit={submitPage} modalLanguages={doneLanguageArray} key={4}></OverviewPage>
  ];

  return (
    <div>
      <UploadBooksNavigation pageNumber={currentPage} changePage={changePage}
        allowContinue={allowChangePage()} pageStatus={[generalDone, readDone, exploreDone, learnDone, false]}
        changeLanguage={setLanguage} currentLanguage={language} startedLanguages={startedLanguages}></UploadBooksNavigation>
      { pages[currentPage]}
    </div>
  );

};
