import React, { useState } from 'react';
import {  Language, LanguageLabels } from '../../models/Languages';
import uploadBooksStyles from '../UploadBooksPage.module.css';
import wizardStyles from '../BookWizardPage.module.css';
import styles from './OverviewPage.module.css';
import '../../App.css';
type OverviewPageProps = {
  onSubmit: (okLanguages: Map<Language, boolean>) => Promise<void>;
  modalLanguages: Array<Language>
};

/**
 * Overview Page for Book Wizard
 */
export const OverviewPage: React.FC<OverviewPageProps> = ({onSubmit, modalLanguages}) => {
  // handles when upload is clicked. No need to display success, as page redirects when upload is succesful
  const handleSubmit = (): void  => {
    onSubmit(checked).catch(err => alert(err));
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  
  const [checked, setChecked] = useState<Map<Language, boolean>>
  (new Map(modalLanguages.map( (lang) => [lang, false])));

  const toggleCheck = (lang: Language): void => {
    setChecked( (prevState) => new Map(prevState).set(lang, !prevState.get(lang))
    );
  };


  return (
    <div>
      <div className = {wizardStyles.mainDivElement}>   
        <div className= {styles.center}>
          <div className = {styles.comingSoon}>
                Coming Soon!
            <div className = "body3">
              Mobile Preview is coming soon! Please double check all screens before submitting
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
                <button className={uploadBooksStyles.cancelBtn} type="button" onClick={() => setShowModal(false) }>Cancel</button>
                <button className={uploadBooksStyles.deleteBtn} type="button" onClick= { () => onSubmit(checked).catch(err => alert(err))}>Upload</button>
              </div>
            </div> 
          </div>
        </div>} 
    </div>
  );
};