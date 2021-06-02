import React, { useState } from 'react';
import { Language, LanguageLabels } from '../models/Languages';
import editImage from '../assets/images/pencil.svg';
import newImage from '../assets/images/plus-circle-solid.svg';
import styles from './UploadBooksDropdown.module.css';

type UploadBookDropdownProps = {
  onLanguageChange: (data: Language) => void;
  currentLanguage: Language
};


export const UploadBooksDropdown: React.FC<UploadBookDropdownProps> = ({onLanguageChange, currentLanguage}) => {
  const handleLanguageChange = (data: Language): void => {
    onLanguageChange(data);
    setShowDropDown(false);
  };
  const languageArr = Object.entries(LanguageLabels);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const options = Array(languageArr.length).fill(null)
    .map( (_, index) => (
      <button key={index} 
        className={ index == languageArr.length-1 ? styles.lastDropdownElement:styles.dropdownElement} 
        onClick = { () => handleLanguageChange(languageArr[index][0] as Language)}>
        {languageArr[index][1]}
        <div className={styles.imageContainer}>
          Edit
          <img src={editImage} className={styles.buttonImage} ></img>
        </div>
        
      </button>
    ) );
  return (
    <div>
      <button className={showDropDown ? styles.firstDropdownElement : styles.roundedDropdownElement} onClick = {() => setShowDropDown(!showDropDown)}> 
        {LanguageLabels[currentLanguage]}
      </button>
      {showDropDown && < div className={styles.dropdownContent}>
        {options}
      </div>}
    </div>
  );
}; 