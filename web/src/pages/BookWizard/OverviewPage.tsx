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
        <div className={tstyles.modal}>
          <div className={tstyles.modalContent}>
            <form>
              <div>
                <p className={tstyles.modalTitle}>Which version(s) of this book would you like to delete?</p>
                {modalLanguages.map(lang => (
                  <label key={lang} className={tstyles.checkboxContainer} htmlFor={lang}>
                    {LanguageLabels[lang]}
                    <input id={lang} type="checkbox" />
                    <span className={tstyles.checkmark}></span>
                    <br />
                  </label>
                ))}
              </div> 
            </form>
          </div>
        </div>} 
    </div>
  );
};