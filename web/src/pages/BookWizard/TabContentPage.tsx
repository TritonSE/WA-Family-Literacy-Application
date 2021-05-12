import React, { useState, useEffect } from 'react';
import { TabContent } from '../../models/Book';
import Editor from 'ckeditor5/build/ckeditor';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ImageUploadAdapter } from "../../api/ImageUploadAdapter";
import './TabContentPage.module.css';
import '../../App.css';
import styles from './TabContentPage.module.css';

type TabConentPageProps = {
  onContentChange: ( data: TabContent ) => void
};

console.log(process.env);

export const TabContentPage: React.FC<TabConentPageProps> = ( {onContentChange}) => {

  const [video, setVideo] = useState< string | undefined>(undefined);
  const [body, setBody] = useState< string >("");
  useEffect( () => {
    onContentChange({
      video: video, 
      body: body,
    });
  }, [body, video]);

  function CustomUploadAdapter( editor: any ): any {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader: any ) => {
      // Configure the URL to the upload script in your back-end here!
      return new ImageUploadAdapter( loader );
    };
  }

  const editorConfiguration = {
    toolbar: [ 'heading','|','bold','italic','underline','link','bulletedList','numberedList', '|','blockQuote','imageUpload','insertTable','undo','redo'],
    extraPlugins: [ CustomUploadAdapter ]
  };


  return (
    <div>
      <div className = {styles.videoText}>
        Video
      </div>
      <input 
        type="text"
        placeholder="Enter youtube url here"
        className={styles.inputField}
        onChange={ e => setVideo(e.target.value)}
      />
      <div className = {styles.editorText}>
        Write Here
      </div>
      <CKEditor
        className={styles.ckeditor}
        editor= { Editor }
        config = { editorConfiguration }
        onChange= { (event: any, editor: any) => {
          const data = editor.getData();
          setBody(data);
        }}/>
    </div>
  );
};

