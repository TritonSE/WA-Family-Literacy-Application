import React from 'react';
import NavigationButtonImage from '../assets/images/chevron-right-solid.svg';
import styles from './UploadBooksNavigation.module.css';
import '../App.css';

type UploadBooksNavigationProps = {
  pageNumber: number
  pageName: string
};

export const UploadBooksNavigation: React.FC<UploadBooksNavigationProps> = ({pageNumber, pageName}) => {


  return (
    <div>
      <div className={styles.navigation}>
        <div>
          <button className={styles.navigationButton}>
            <img src={NavigationButtonImage} alt='' className = {styles.navigationButtonLeft}/>
          </button>
        </div>
        <div className= {styles.pageName}>
          {pageName}
        </div>
        <div>
          <button className = {styles.navigationButton}>
            <img src={NavigationButtonImage} alt='' className= {styles.navigationButtonRight}/>
          </button>
        </div>
      </div>



    </div>
  );

};