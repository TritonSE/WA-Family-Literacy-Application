import React from 'react';
import { Language, LanguageLabels } from '../models/Languages';
import styles from './UploadBooksDropdown.module.css';

type UploadBookDropdownProps = {
  onDropdownChange: (data: Language) => void;
  currentLanguage: Language
};


export const UploadBooksDropdown: React.FC<UploadBookDropdownProps> = ({onDropdownChange, currentLanguage}) => {
  const languageArr = Object.entries(LanguageLabels);
  const options = Array(languageArr.length).fill(null)
    .map( (_, index) => (
      <option key={index} value={languageArr[index][0]}>{languageArr[index][1]}</option>
    ) );
  return (
    <div>
      <select defaultValue={currentLanguage} onChange={ (e) => onDropdownChange(e.target.value as Language) }className={styles.dropdown}>
        {options}
      </select>
    </div>
  );
}; 