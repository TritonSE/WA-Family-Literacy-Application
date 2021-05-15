import React from 'react';
import { Link } from 'react-router-dom';
import NavigationButtonImage from '../assets/images/chevron-right-solid.svg';
import GreyCircle from '../assets/images/gray-circle.svg';
import GreenCircle from '../assets/images/green-circle.svg';
import CheckedCircle from '../assets/images/check-circle.svg';
import CancelImage from '../assets/images/times-solid.svg';
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
    let child: JSX.Element | null = null;
    if(i < pageNumber)
      child = checkCircleImg;
    else if (i == pageNumber)
      child = greenCircleImg;
    else
      child = greyCircleImg;
    const pageName = <p className={styles.pageLabel}>{pages[i]}</p>;
    const div = React.createElement("div", {className: styles.circleImageContainer} ,[child, pageName]);
    progressBar.push(div);
    if(i != 4)
      progressBar.push(kebebSkewer);
  }
  
  return (
    <div>
      <div className={styles.navigationContainer}>
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
      </div>
      <div className={styles.cancelImageContainer}>
        <Link to="/upload">
          <button className = {styles.navigationButton}>
            <img src={CancelImage} alt='' className={styles.cancelImage} />
          </button>
        </Link>
      </div>
      <div className = {styles.progressBarContainer}>
        <div className = {styles.progressBar}>
          {/* <div className={styles.progressCircleContainer}>
            {checkCircleImg}
            <p>Read</p>
          </div>
          {kebebSkewer} */}
          {progressBar}
        </div>
      </div>
    </div>
  );

};