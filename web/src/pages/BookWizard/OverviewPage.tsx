import React, { useState, useEffect } from 'react';
import { TabContent } from '../../models/Book';
import {  Language, LanguageLabels } from '../../models/Languages';
import Editor from 'ckeditor5/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import requiredFieldImage from '../../assets/images/star-of-life-solid.svg';
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


  return (
    <div>
      <div className = {wizardStyles.mainDivElement}> 
        <div className={styles.pageContainer}>
          <div>
            <div className={wizardStyles.inputBoxTitle}>
          Book Cover (IMG)
              <img src={requiredFieldImage} alt='' className={wizardStyles.requiredImage}/>
            </div>
            <div className = {styles.dropZone}>
              <div className = {styles.dropZoneContent}>
                <img src={previewUrl} alt='image' className={styles.dropZoneImage}/>
              </div>
            </div>
          </div>
          <div className={styles.inputElementContainer}>
            <div className = {styles.inputElement}>
              <div className = {wizardStyles.inputBoxTitle}>
              Title
                <img src={requiredFieldImage} alt='' className={wizardStyles.requiredImage}/>
              </div>
              <div>
                <input className = {styles.inputBox} value={title} type="text" disabled={true}></input>
              </div>
            </div>
            <div className = {styles.inputElement}>
              <div className = {wizardStyles.inputBoxTitle}>
              Author
                <img src={requiredFieldImage} alt='' className={wizardStyles.requiredImage}/>
              </div>
              <div>
                <input className = {styles.inputBox} value={author} type="text" disabled={true}></input>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.headerText}>
          Read
        </div>
        <div className={styles.videoText}>
          Video
        </div>
        <input
          type="text"
          className={styles.inputField}
          value={readTab.video}
          disabled={true}
        />
        <div className={styles.editorText}>
          Body
        </div>
        <CKEditor
          editor={Editor}
          data={readTab.body}
          disabled={true}
        />

        <div className={styles.headerText}>
          Explore
        </div>
        <div className={styles.videoText}>
          Video
        </div>
        <input
          type="text"
          className={styles.inputField}
          value={exploreTab.video}
          disabled={true}
        />
        <div className={styles.editorText}>
          Body
        </div>
        <CKEditor
          editor={Editor}
          data={exploreTab.body}
          disabled={true}
        />

        <div className={styles.headerText}>
          Learn
        </div>
        <div className={styles.videoText}>
          Video
        </div>
        <input
          type="text"
          className={styles.inputField}
          value={learnTab.video}
          disabled={true}
        />
        <div className={styles.editorText}>
          Body
        </div>
        <CKEditor
          editor={Editor}
          data={learnTab.body}
          disabled={true}
        />

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