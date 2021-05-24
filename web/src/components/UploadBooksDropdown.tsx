import React from 'react';
import { Language } from '../models/Languages';
import styles from './UploadBooksDropdown.module.css';

type UploadBookDropdownProps = {
  onDropdownChange: (data: Language) => void;
};


export const UploadBooksDropdown: React.FC<UploadBookDropdownProps> = ({onDropdownChange}) => {
  const handleDropDownChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onDropdownChange(newValue);
  }

  return (
    <div>
      <select onChange={ (e) => onDropdownChange(e.target.value) }className={styles.dropdown}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="zh">Chinese</option>
        <option value="vi">Vietnamese</option>
        <option value="ar">Arabic</option>
        <option value="am">Amharic</option>
      </select>
    </div>




  );


}; 