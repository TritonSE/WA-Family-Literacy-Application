import React from 'react';
import styles from './UploadBooksDropdown.module.css';

export const UploadBooksDropdown: React.FC = () => {


  return (
    <div>
      <select className={styles.dropdown}>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
    </div>




  );


}; 