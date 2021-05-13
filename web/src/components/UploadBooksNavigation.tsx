import React from 'react';
import NavigationButtonImage from '../assets/images/chevron-right-solid.svg';
import GreyCircle from '../assets/images/gray-circle.svg';
import GreenCircle from '../assets/images/green-circle.svg';
import CheckedCircle from '../assets/images/check-circle.svg';
import styles from './UploadBooksNavigation.module.css';
import '../App.css';

type UploadBooksNavigationProps = {
  pageNumber: number
  pageName: string
};

export const UploadBooksNavigation: React.FC<UploadBooksNavigationProps> = ({pageNumber, pageName}) => {
  const progressBar = [];

  const kebebSkewer = <span className={styles.skewer}></span>;
  
  for (let i = 1; i < pageNumber; i++) {
    progressBar.push(
      <img src={CheckedCircle} alt = '' className={styles.progressCircles}></img>
    );
    progressBar.push(kebebSkewer);
  }

  progressBar.push(<img src = {GreenCircle} alt = '' className={styles.progressCircles}></img>);
  progressBar.push(kebebSkewer);

  for (let i = pageNumber; i<5; i++) {
    progressBar.push(
      <img src={GreyCircle} alt = '' className={styles.progressCircles}></img>
    );
    progressBar.push(kebebSkewer);
  }

  progressBar.pop();

  return (
    <div>
      <div className={styles.navigation}>
        <div>
          {pageNumber != 1 ? 
            <button className={styles.navigationButton}>
              <img src={NavigationButtonImage} alt='' className = {styles.navigationButtonLeft}/>
            </button> : 
            <div className={styles.navigationButtonIcon}></div>}
        </div>
        <div className= {styles.pageName}>
          {pageName}
        </div>
        <div>
          {pageNumber != 5 ? 
            <button className = {styles.navigationButton}>
              <img src={NavigationButtonImage} alt='' className= {styles.navigationButtonRight}/>
            </button> : <div className={styles.navigationButtonIcon}></div> }
        </div>
      </div>
      <div className = {styles.progressBarContainer}>
        <div className = {styles.progressBar}>
          {progressBar}
        </div>
      </div>
    </div>
  );

};