import React, { useState, useEffect, useRef } from 'react';
import { UploadBooksNavigation } from '../../components/UploadBooksNavigation';
import '../../App.css';
import styles from './GeneralPage.module.css';
import wizardStyles from '../BookWizardPage.module.css';

type GeneralPageProps = {
  onTitleChange: ( data: string ) => void
  onAuthorChange: (data: string) => void 
  onImageChange: (data: File | null) => void
};

export const GeneralPage: React.FC<GeneralPageProps> = ({onTitleChange, onAuthorChange, onImageChange}) => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [image, setImage] = useState<File|null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect( () => {
    onTitleChange(title);
  }, [title]);

  useEffect( () => {
    onAuthorChange(author);
  }, [author]);

  useEffect( () => {
    onImageChange(image);
  }, [image]);


  const handleOnDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
  };

  const handleOnDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    const imageFile = e.dataTransfer.files[0];
    handleFile(imageFile);

  };

  const handleFile = (file: File): void => {
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return(
    <div>
      <UploadBooksNavigation pageName={"General"} pageNumber={1}>
      </UploadBooksNavigation>
      <div className = {wizardStyles.mainDivElement}>
        <div className={styles.imageTitle}>
          Book Cover (IMG)
        </div>
        <div 
          className = {styles.dropZone}
          onDragOver = {handleOnDragOver}
          onDrop = {handleOnDrop}
          onClick = { () => {
            if (fileInput.current != null) {
              fileInput.current.click();
            }}}>

          <div className = {styles.dropZoneContent}>
            {image != null ? 
              <img src={previewUrl} alt='image' className={styles.dropZoneImage}/> : <p className={styles.dropZoneText}>Upload Image Here</p>}
            <input type="file"
              ref = {fileInput} hidden
              onChange = { (e) => {
                if(e.target != null && e.target.files != null) {
                  handleFile(e.target.files[0]);}}}/>
          </div>
        </div>
      </div>
    </div>
  );
};