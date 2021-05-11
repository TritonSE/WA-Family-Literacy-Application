import React, { useState, useEffect } from 'react';

type GeneralPageProps = {
  onTitleChange: ( data: string ) => void
  onAuthorChange: (data: string) => void 
  onImageChange: (data: Uint8Array) => void
};

export const GeneralPage: React.FC<GeneralPageProps> = ({onTitleChange, onAuthorChange, onImageChange}) => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [image, setImage] = useState<Uint8Array>(new Uint8Array());

  useEffect( () => {
    onTitleChange(title);
  }, [title]);

  useEffect( () => {
    onAuthorChange(author);
  }, [author]);

  useEffect( () => {
    onImageChange(image);
  }, [image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const list = e.target.files;
    if (list != null) {
      const newImage = list[0];
      newImage.arrayBuffer().then( (array) => {
        setImage(new Uint8Array(array));
      });
      
    }

  };

  return(
    <div>
      <input
        type="file"
        placeholder="Import File Here"
        onChange={ e => handleImageChange(e)}
      />
    </div>
  );
};