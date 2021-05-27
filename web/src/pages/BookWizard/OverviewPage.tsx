import React, { useState } from 'react';
import {  Language, LanguageLabels } from '../../models/Languages';
import tstyles from '../UploadBooksPage.module.css';
import wizardStyles from '../BookWizardPage.module.css';
import styles from './OverviewPage.module.css';
import '../../App.css';
type OverviewPageProps = {
  onSubmit: () => Promise<void>;
};

/**
 * Overview Page for Book Wizard
 */
export const OverviewPage: React.FC<OverviewPageProps> = ({onSubmit}) => {
  // handles when upload is clicked. No need to display success, as page redirects when upload is succesful
  const handleOnClick = (): void  => {
    onSubmit().catch(err => alert(err));
  };

  const modalLanguages: Array<Language> = ['en', "fr"];

  const [showModal, setShowModal] = useState<boolean>(false);

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
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div>
              <p className={styles.modalTitle}>Which version(s) of this book would you like to delete?</p>
              <ul className={styles.ulist}> 
                {modalLanguages.map(lang => (
                  <li className={styles.listElement}key={lang}>
                    <label key={lang} className={styles.checkboxContainer} htmlFor={lang}>
                      {LanguageLabels[lang]}
                      <input id={lang} type="checkbox" />
                      <span className={styles.checkmark}></span>
                    </label>
                  </li>
                ))}
              </ul>
            </div> 
          </div>
        </div>} 
    </div>
  );
};