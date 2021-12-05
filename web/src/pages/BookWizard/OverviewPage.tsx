import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { TabContent } from '../../models/Book';
import {  Language, LanguageLabels } from '../../models/Languages';
import uploadBooksStyles from '../UploadBooksPage.module.css';
import wizardStyles from '../BookWizardPage.module.css';
import styles from './OverviewPage.module.css';
import '../../App.css';
type OverviewPageProps = {
  onSubmit: (okLanguages: Map<Language, boolean>) => Promise<void>;
  modalLanguages: Array<Language>
  title: string
  author: string
  image: File | null
  readTab: TabContent
  exploreTab: TabContent
  learnTab: TabContent
};

type TabPreviewProps = {
  tab: TabContent
  type: string
  title: string
  author: string
  image: File | null
};

function parseYoutubeURL(url: string): string {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const m = url.match(regExp);
  if (m && m[2].length == 11) {
    return m[2];
  }
  return "";
}

const TabPreview: React.FC<TabPreviewProps> = ({tab, type, title, author, image}) => {
  const [imageUrl, setImageUrl] = useState("");

  const mdComponents = {
    img: ({...props}) => {
      return (
        <div className={styles.mdImgContainer}>
          <img src={props.src} className={styles.mdImage}/>
        </div>
      );
    },
  };

  useEffect( () => {
    if (image != null) {
      setImageUrl(URL.createObjectURL(image));
    }
  }, [image]);

  return (
    <div className={styles.tabContainer}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt='image' className={styles.coverImage}/>            
      </div>
      <div className={styles.bookTitle}>{title}</div>
      <div className={styles.bookAuthor}>By {author}</div>

      <div className={styles.buttonGroup}>
        {type === "read" ? 
          (<div className={styles.tabButtonActive}>
            <div className={styles.buttonActive}>Read</div>
          </div>) :
          (<div className={styles.tabButtonInactive}>
            <div className={styles.buttonInactive}>Read</div>
          </div>)}

        {type === "explore" ? 
          (<div className={styles.tabButtonActive}>
            <div className={styles.buttonActive}>Explore</div>
          </div>) :
          (<div className={styles.tabButtonInactive}>
            <div className={styles.buttonInactive}>Explore</div>
          </div>)}

        {type === "learn" ? 
          (<div className={styles.tabButtonActive}>
            <div className={styles.buttonActive}>Learn</div>
          </div>) :
          (<div className={styles.tabButtonInactive}>
            <div className={styles.buttonInactive}>Learn</div>
          </div>)}
      </div>

      {tab.video ? (<div className={styles.videoContainer}>

        <iframe className={styles.video}
          src={`https://www.youtube.com/embed/${parseYoutubeURL(tab.video)}`}
          title="YouTube video player" frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen></iframe>
      </div>) : null}

      <div className={styles.markdownText}>
        <ReactMarkdown components={mdComponents} linkTarget='_blank'>
          {tab.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};

/**
 * Overview Page for Book Wizard
 */
export const OverviewPage: React.FC<OverviewPageProps> = ({onSubmit, modalLanguages,
  title, author, image, readTab, exploreTab, learnTab}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [checked, setChecked] = useState<Map<Language, boolean>>
  (new Map(modalLanguages.map( (lang) => [lang, false])));

  const toggleCheck = (lang: Language): void => {
    setChecked( (prevState) => new Map(prevState).set(lang, !prevState.get(lang))
    );
  };


  const cancelModal = (): void => {
    setShowModal(false);
    setChecked(new Map(modalLanguages.map((lang) => [lang, false])));
  };

  const atLeastOneChecked = Array.from(checked.values()).includes(true);

  return (
    <div>
      <div className = {wizardStyles.mainDivElement}> 
        <div className={styles.pageContainer}>
          <TabPreview 
            tab={readTab} 
            type={"read"} 
            title={title} 
            author={author} 
            image={image}/>

          <TabPreview 
            tab={exploreTab} 
            type={"explore"} 
            title={title} 
            author={author} 
            image={image}/>

          <TabPreview 
            tab={learnTab} 
            type={"learn"} 
            title={title} 
            author={author} 
            image={image}/>
        </div>

        <div className = {styles.buttonContainer}>
          <button className={styles.uploadButton} onClick = { () => setShowModal(true)}>
            <span className={styles.uploadButtonText}>
                  Upload Book
            </span>
          </button>
        </div>
      </div>

      {showModal ?
        <div className={uploadBooksStyles.modal}>
          <div className={uploadBooksStyles.modalContent}>
            <div>
              <p className={uploadBooksStyles.modalTitle}>Select the language of the book you would like to upload</p>
              <div className={styles.container}>
                {modalLanguages.map( (lang, index) => (
                  <div className={index % 2 == 0 ? styles.left : styles.right} key={lang}>
                    <label className={uploadBooksStyles.checkboxContainer} htmlFor={lang}>
                      {LanguageLabels[lang]}
                      <input id={lang} onChange={()=> toggleCheck(lang)}type="checkbox" />
                      <span className={uploadBooksStyles.checkmark}></span>
                    </label>
                  </div>
                ))}
                <button className={uploadBooksStyles.cancelBtn} type="button" onClick={() => cancelModal() }>Cancel</button>
                <button className={uploadBooksStyles.deleteBtn} disabled={!atLeastOneChecked} type="button"
                  onClick= { () => onSubmit(checked).catch(err => alert(err))}>Upload</button>
              </div>
            </div>
          </div>
        </div> : null}
    </div>
  );
};
