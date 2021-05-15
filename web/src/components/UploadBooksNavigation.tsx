import React from 'react';
import NavigationButtonImage from '../assets/images/chevron-right-solid.svg';
import GreyCircle from '../assets/images/gray-circle.svg';
import GreenCircle from '../assets/images/green-circle.svg';
import CheckedCircle from '../assets/images/check-circle.svg';
import styles from './UploadBooksNavigation.module.css';
import '../App.css';

type UploadBooksNavigationProps = {
  pageNumber: number
  pageChange: (newPage: number) => void; 
  allowContinue: boolean
};

export const UploadBooksNavigation: React.FC<UploadBooksNavigationProps> = ({pageNumber, pageChange, allowContinue}) => {
  const progressBar = [];
  const kebebSkewer = <span className={styles.skewer}></span>;
  const checkCircleImg = <img src={CheckedCircle} alt = '' className={styles.progressCircles}></img>;
  const greenCircleImg = <img src = {GreenCircle} alt = '' className={styles.progressCircles}></img>;
  const greyCircleImg = <img src={GreyCircle} alt = '' className={styles.progressCircles}></img>;
  const pages = ["General", "Read", "Explore", "Learn", "Overview"];
  const pageName = pages[pageNumber];
  

  for(let i = 0; i < 5; i++) {
    if(i < pageNumber) 
      progressBar.push(checkCircleImg);
    else if (i == pageNumber)
      progressBar.push(greenCircleImg);
    else
      progressBar.push(greyCircleImg);
    if(i != 4)
      progressBar.push(kebebSkewer);
  }
  
  return (
    <div>
      <div className={styles.navigation}>
        <div>
          {pageNumber != 0 ? 
            <button className={styles.navigationButton} onClick={ () => pageChange(pageNumber-1)}>
              <img src={NavigationButtonImage} alt='' className = {styles.navigationButtonLeft}/>
            </button> : 
            <div className={styles.navigationButtonIcon}></div>}
        </div>
        <div className= {styles.pageName}>
          {pageName}
        </div>
        <div>
          {pageNumber != 4 ? 
            <button className = {styles.navigationButton} disabled = {!allowContinue} onClick={ () => pageChange(pageNumber+1)}>
              {allowContinue ? 
                <img src={NavigationButtonImage} alt='' className= {styles.navigationButtonRight}/> : <img src={NavigationButtonImage} alt='' className={styles.navigationButtonRightDisabled}></img>}
            </button> : <div className={styles.navigationButtonIcon}></div>}
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