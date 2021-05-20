import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import NavigationButtonImage from '../assets/images/chevron-right-solid.svg';
import GreyCircle from '../assets/images/gray-circle.svg';
import GreenCircle from '../assets/images/green-circle.svg';
import CheckedCircle from '../assets/images/check-circle.svg';
import CancelImage from '../assets/images/times-solid.svg';
import styles from './UploadBooksNavigation.module.css';
import '../App.css';

type UploadBooksNavigationProps = {
  pageNumber: number
  pageChange: (newPage: number) => void; //function to render a new page below the navigation component
  allowContinue: boolean //controls if user can move onto the next page
};

/**
 * Renders the navigation wizard bar at the top of the book wizard
 */
export const UploadBooksNavigation: React.FC<UploadBooksNavigationProps> = ({pageNumber, pageChange, allowContinue}) => {
  // const progressBar = [];
  const pages = ["General", "Read", "Explore", "Learn", "Overview"];
  const pageName = pages[pageNumber];
  const history = useHistory();
  const skewer = <span className={styles.skewer}/>;
  const progressBar = new Array(5).fill(null)
    .map((_, index) => (
      <div className={styles.circleImageContainer}  key={index}>
        <button onClick={() => console.log("CLICK")} className={styles.navigationButton}>
          <img src={index < pageNumber ? CheckedCircle : index == pageNumber ? GreenCircle : GreyCircle} className={styles.progressCircles}/>
        </button>
        <p className={styles.pageLabel}>{pages[index]}</p>
      </div>
    )).flatMap((a) => [skewer, a]).slice(1);


  // creates a div with an image and a text child, and also creates the line in between them  
  // for(let i = 0; i < 5; i++) {
  //   let child: JSX.Element | null = null;
  //   // ensure all elements have unique keys
  //   const imageKey = i.toString() + "img";
  //   const skewerKey = i.toString() + "skew";
    
  //   if(i < pageNumber)
  //     child = <img src={CheckedCircle} key={imageKey}alt = '' className={styles.progressCircles}/>;
  //   else if (i == pageNumber)
  //     child = <img src = {GreenCircle} alt = '' key={imageKey} className={styles.progressCircles}/>;
  //   else
  //     child = <img src={GreyCircle} alt = '' key={imageKey} className={styles.progressCircles}/>;
    
  //   const pageName = <p className={styles.pageLabel} key={pages[i]}>{pages[i]}</p>;
  //   const nameImageDiv = React.createElement("div", {className: styles.circleImageContainer, key: i.toString()} ,[child, pageName]);
  //   const kebebSkewer = <span className={styles.skewer} key={skewerKey}></span>;
    
  //   progressBar.push(nameImageDiv);
  //   if(i != 4)
  //     progressBar.push(kebebSkewer);
  // }
  
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
        <button className = {styles.navigationButton} onClick = {() => history.push("/books")}>
          <img src={CancelImage} alt='' className={styles.cancelImage} />
        </button>
      </div>
      <div className = {styles.progressBarContainer}>
        <div className = {styles.progressBar}>
          {progressBar}
        </div>
      </div>
    </div>
  );

};