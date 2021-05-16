import React from 'react';
import wizardStyles from '../BookWizardPage.module.css';
import styles from './OverviewPage.module.css';
type OverviewPageProps = {
  onSubmit: () => Promise<undefined>;
};

export const OverviewPage: React.FC<OverviewPageProps> = ({onSubmit}) => {
  const handleOnClick = (): void  => {
    onSubmit().catch(err => alert(err));
  };

  return (
    <div>
      <div className = {wizardStyles.mainDivElement}>   
        <div className= {styles.center}>
          <div className = {styles.comingSoon}>
                Coming Soon!
          </div>
        </div>

        <div className = {styles.buttonContainer}>
          <button className={styles.uploadButton} onClick = {handleOnClick}>
            <span className={styles.uploadButtonText}> 
                  Upload Book
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};