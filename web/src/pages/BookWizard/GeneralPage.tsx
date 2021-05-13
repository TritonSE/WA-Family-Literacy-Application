import React, { useState, useEffect, useRef } from 'react';
import { UploadBooksNavigation } from '../../components/UploadBooksNavigation';
import '../../App.css';
import styles from './GeneralPage.module.css';

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

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   const list = e.target.files;
  //   if (list != null) {
  //     const newImage = list[0];
  //     newImage.arrayBuffer().then( (array) => {
  //       setImage(new Uint8Array(array));
  //     });
      
  //   }
  // };

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
      <div className = {styles.wrapper}>
        <div 
          className = {styles.dropZone}
          onDragOver = {handleOnDragOver}
          onDrop = {handleOnDrop}
          onClick = { () => {
            if (fileInput.current != null) {
              fileInput.current.click();
            }}}>
          <p>Rip
            <input type="file"
              ref = {fileInput} hidden
              onChange = { (e) => {
                if(e.target != null && e.target.files != null) {
                  handleFile(e.target.files[0]);
                }}}/>
          </p>
        </div>
      </div>
      { image != null && <div className={styles.image}>
        <img src={previewUrl} alt='image' /> 
        <span> {image.name} </span>
      </div> }
    </div>
  );
};