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
          {pageNumber != 1 ? 
            <button className={styles.navigationButton}>
              <img src={NavigationButtonImage} alt='' className = {styles.navigationButtonLeft}/>
            </button> : 
            <div className={styles.blankDiv}></div>}
        </div>
        <div className= {styles.pageName}>
          {pageName}
        </div>
        <div>
          {pageNumber != 5 ? 
            <button className = {styles.navigationButton}>
              <img src={NavigationButtonImage} alt='' className= {styles.navigationButtonRight}/>
            </button> : <div className={styles.blankDiv}></div> }
        </div>
      </div>
    </div>
  );

};