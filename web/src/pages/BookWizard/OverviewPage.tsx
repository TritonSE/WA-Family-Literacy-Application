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

/**
 * Overview Page for Book Wizard
 */
export const OverviewPage: React.FC<OverviewPageProps> = ({onSubmit, modalLanguages, 
  title, author, image, readTab, exploreTab, learnTab}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  const [checked, setChecked] = useState<Map<Language, boolean>>
  (new Map(modalLanguages.map( (lang) => [lang, false])));

  useEffect( () => {
    if (image != null) {
      setPreviewUrl(URL.createObjectURL(image));
    }
  }, [image]);

  const toggleCheck = (lang: Language): void => {
    setChecked( (prevState) => new Map(prevState).set(lang, !prevState.get(lang))
    );
  };


  const cancelModal = (): void => {
    setShowModal(false);
    setChecked(new Map(modalLanguages.map((lang) => [lang, false])));
  };

  const atLeastOneChecked = Array.from(checked.values()).includes(true);

  const mdComponents = {
    img: ({...props}) => {
      return (
        <div className={styles.mdImgContainer}>
          <img src={props.src} className={styles.mdImage}/>
        </div>
      );
    },
  };

  return (
    <div>
      <div className = {wizardStyles.mainDivElement}> 
        <div className={styles.pageContainer}>
          <div className={styles.tabContainer}>
            <div className={styles.imageContainer}>
              <img src={previewUrl} alt='image' className={styles.coverImage}/>            
            </div>
            <div className={styles.bookTitle}>{title}</div>
            <div className={styles.bookAuthor}>By {author}</div>

            <div className={styles.buttonGroup}>
              <div className={styles.tabButtonActive}>
                <div className={styles.buttonActive}>Read</div>
              </div>
              <div className={styles.tabButtonInactive}>
                <div className={styles.buttonInactive}>Explore</div>
              </div>
              <div className={styles.tabButtonInactive}>
                <div className={styles.buttonInactive}>Learn</div>
              </div>
            </div>

            <div className={styles.videoContainer}>
              <iframe className={styles.video} src={readTab.video}></iframe>
            </div>

            <div className={styles.markdownText}>
              <ReactMarkdown components={mdComponents}>
                {readTab.body}
              </ReactMarkdown>
            </div>
          </div>

          <div className={styles.tabContainer}>
            <div className={styles.imageContainer}>
              <img src={previewUrl} alt='image' className={styles.coverImage}/>            
            </div>
            <div className={styles.bookTitle}>{title}</div>
            <div className={styles.bookAuthor}>By {author}</div>

            <div className={styles.buttonGroup}>
              <div className={styles.tabButtonInactive}>
                <div className={styles.buttonInactive}>Read</div>
              </div>
              <div className={styles.tabButtonActive}>
                <div className={styles.buttonActive}>Explore</div>
              </div>
              <div className={styles.tabButtonInactive}>
                <div className={styles.buttonInactive}>Learn</div>
              </div>
            </div>

            <div className={styles.videoContainer}>
              <iframe className={styles.video} src={exploreTab.video}></iframe>
            </div>

            <div className={styles.markdownText}>
              <ReactMarkdown components={mdComponents}>
                {exploreTab.body}
              </ReactMarkdown>
            </div>
          </div>

          <div className={styles.tabContainer}>
            <div className={styles.imageContainer}>
              <img src={previewUrl} alt='image' className={styles.coverImage}/>            
            </div>
            <div className={styles.bookTitle}>{title}</div>
            <div className={styles.bookAuthor}>By {author}</div>

            <div className={styles.buttonGroup}>
              <div className={styles.tabButtonInactive}>
                <div className={styles.buttonInactive}>Read</div>
              </div>
              <div className={styles.tabButtonInactive}>
                <div className={styles.buttonInactive}>Explore</div>
              </div>
              <div className={styles.tabButtonActive}>
                <div className={styles.buttonActive}>Learn</div>
              </div>
            </div>

            <div className={styles.videoContainer}>
              <iframe className={styles.video} src={learnTab.video}></iframe>
            </div>

            <div className={styles.markdownText}>
              <ReactMarkdown components={mdComponents}>
                {learnTab.body.indexOf("<p>") == -1 ?
                  learnTab.body : learnTab.body.substring(3, learnTab.body.length - 4)
                }
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <div className = {styles.buttonContainer}>
          <button className={styles.uploadButton} onClick = { () => setShowModal(true)}>
            <span className={styles.uploadButtonText}> 
                  Upload Book
            </span>
          </button>
        </div>
      </div>

      {showModal && 
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
        </div>} 
    </div>
  );
};