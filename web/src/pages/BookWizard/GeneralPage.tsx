import React, { useState, useEffect, useRef } from 'react';
import '../../App.css';
import styles from './GeneralPage.module.css';
import wizardStyles from '../BookWizardPage.module.css';
import requiredFieldImage from '../../assets/images/star-of-life-solid.svg';

type GeneralPageProps = {
  onTitleChange: ( data: string ) => void
  onAuthorChange: (data: string) => void 
  onImageChange: (data: File | null) => void
  currentTitle: string
  currentAuthor: string
  currentImage: File | null 
};

export const GeneralPage: React.FC<GeneralPageProps> = ({onTitleChange, onAuthorChange, onImageChange, currentTitle, currentAuthor, currentImage}) => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [image, setImage] = useState<File|null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInput = useRef<HTMLInputElement>(null);
  const acceptableMimeType = ["image/png", "image/jpeg"];

  useEffect( () => {
    onTitleChange(title);
  }, [title]);

  useEffect( () => {
    onAuthorChange(author);
  }, [author]);

  useEffect( () => {
    onImageChange(image);
  }, [image]);

  useEffect( () => {
    if (currentImage != null) {
      setImage(currentImage);
      setPreviewUrl(URL.createObjectURL(currentImage));
    }

    setTitle(currentTitle);
    setAuthor(currentAuthor);
  }, []);


  const handleOnDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
  };

  const handleOnDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    const imageFile = e.dataTransfer.files[0];
    if(acceptableMimeType.indexOf(imageFile.type) == -1) {
      alert("Please enter a jpeg or a png file");
      return;
    } 
    else {
      handleFile(imageFile);
    }
  };

  const handleFile = (file: File): void => {
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return(
    <div>
      <div className = {wizardStyles.mainDivElement}>
        <div className={styles.pageContainer}>
          <div>
            <div className={styles.imageTitle}>
          Book Cover (IMG)
              <img src={requiredFieldImage} alt='' className={styles.requiredImage}/>
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
                  accept="image/png, image/jpeg" 
                  onChange = { (e) => {
                    if(e.target != null && e.target.files != null) {
                      handleFile(e.target.files[0]);}}}/>
              </div>
            </div>
          </div>
          <div className={styles.inputElementContainer}>
            <div className = {styles.inputElement}>
              <div className = {wizardStyles.inputBoxTitle}>
              Title
                <img src={requiredFieldImage} alt='' className={styles.requiredImage}/>
              </div>
              <div>
                <input className = {styles.inputBox} value={title} type="text" onChange={ (e) => setTitle(e.target.value)}></input>
              </div>
            </div>
            <div className = {styles.inputElement}>
              <div className = {wizardStyles.inputBoxTitle}>
              Author
                <img src={requiredFieldImage} alt='' className={styles.requiredImage}/>
              </div>
              <div>
                <input className = {styles.inputBox} value={author} type="text" onChange={ (e) => setAuthor(e.target.value)}></input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};