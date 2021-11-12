import React, { useState } from 'react';
import { Language, LanguageLabels } from '../models/Languages';
import editImage from '../assets/images/pencil.svg';
import newImage from '../assets/images/plus-circle-solid.svg';
import arrow from '../assets/images/orange-arrow.svg';
import styles from './UploadBooksDropdown.module.css';

type UploadBookDropdownProps = {
  onLanguageChange: (data: Language) => void;
  startedLanguages: Set<Language>   // languages that user has started editing
  currentLanguage: Language
};

/**
 * Dropdown to select language for the upload books wizard
 */
export const UploadBooksDropdown: React.FC<UploadBookDropdownProps> = ({onLanguageChange, startedLanguages, currentLanguage}) => {
  const handleLanguageChange = (data: Language): void => {
    onLanguageChange(data);
    setShowDropDown(false);
  };
  const languages = Object.keys(LanguageLabels) as Language[];
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  const options = languages.filter( (lang) => lang != currentLanguage)
    .map((lang, index) => (
      <button key={index}
        className={styles.dropdownElement}
        onClick = { () => handleLanguageChange(lang)}>
        {LanguageLabels[lang]}
        <div className={styles.imageContainer}>
          {startedLanguages.has(lang) ? "Edit" : "New"}
          <img src={startedLanguages.has(lang) ? editImage : newImage}
            className={styles.buttonImage}>
          </img>
        </div>
      </button>
    ));

  // generates the html for the dropdown

  return (
    <div>
      <button className={showDropDown ? styles.firstDropdownElement : styles.roundedDropdownElement} onClick = {() => setShowDropDown(!showDropDown)}>
        {LanguageLabels[currentLanguage]}
        <div className={styles.imageContainer}>
          <img src={arrow}
            className={showDropDown ? styles.arrowUp : styles.buttonImage}>
          </img>
        </div>
      </button>
      {showDropDown ? < div className={styles.dropdownContent}>
        {options}
      </div> : null}
    </div>
  );
};
