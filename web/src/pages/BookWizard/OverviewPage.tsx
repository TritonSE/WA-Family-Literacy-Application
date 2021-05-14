import React from 'react';
import wizardStyles from '../BookWizardPage.module.css';
import styles from './OverviewPage.module.css';
type OverviewPageProps = {
  onSubmit: () => void;
};

export const OverviewPage: React.FC<OverviewPageProps> = ({onSubmit}) => {


  return (
    <div>
      <div className = {wizardStyles.mainDivElement}>   
        <div className= {styles.center}>
          <div className = {styles.comingSoon}>
                Coming Soon!
          </div>
        </div>

        <div className = {styles.buttonContainer}>
          <button className={styles.uploadButton} onClick = {onSubmit}>
            <span className={styles.uploadButtonText}> 
                  Upload Book
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};