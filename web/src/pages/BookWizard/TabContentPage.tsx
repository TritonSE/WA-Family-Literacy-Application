import React, { useState, useEffect } from 'react';
import { TabContent } from '../../models/Book';
import Editor from 'ckeditor5/build/ckeditor';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ImageUploadAdapter } from "../../api/ImageUploadAdapter";
import requiredFieldImage from '../../assets/images/star-of-life-solid.svg';
import styles from './TabContentPage.module.css';
import '../../App.css';
import wizardStyles from '../BookWizardPage.module.css';
import { Language } from '../../models/Languages';

type TabConentPageProps = {
  onContentChange: ( value: TabContent ) => void
  // the current state of the fields. Used because fields dissapear when component re-renders
  currentContent: TabContent
  language: Language
};

/**
 * Read, Explore, and Learn page for the Upload Books Wizard
 */
export const TabContentPage: React.FC<TabConentPageProps> = ( {onContentChange, currentContent, language}) => {

  const [video, setVideo] = useState< string | undefined>(undefined);
  const [body, setBody] = useState< string >("");
  useEffect( () => {
    onContentChange({
      video: video, 
      body: body,
    });
  }, [body, video]);

  // set current values
  useEffect( () => {
    setBody(currentContent.body);
    setVideo(currentContent.video);
  }, []);

  useEffect( () => {
    setBody(currentContent.body);
    setVideo(currentContent.video);
  }, [language]);


  // function to generate a new custom upload adapter for ckeditor
  function CustomUploadAdapter( editor: any ): any {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader: any ) => {
      return new ImageUploadAdapter( loader );
    };
  }

  const editorConfiguration = {
    toolbar: [ 'heading','|','bold','italic','strikethrough','bulletedList','numberedList', '|', 'blockQuote','imageUpload','insertTable','undo','redo'],
    extraPlugins: [ CustomUploadAdapter ]
  };


  return (
    <div>      
      <div className={wizardStyles.mainDivElement}>
        <div className = {styles.videoText}>
        Video
        </div>
      
        <input 
          type="text"
          className={styles.inputField}
          value={video || ""}
          onChange={ e => setVideo(e.target.value)}
        />
        <div className = {styles.editorText}>
          Write Here
          <img src={requiredFieldImage} alt='' className={wizardStyles.requiredImage}/>
        </div>
        <CKEditor
          editor= { Editor }
          config = { editorConfiguration }
          data = {body} 
          onChange= { (event: any, editor: any) => {
            const data = editor.getData();
            setBody(data);
          }}/>
      </div>
    </div>
  );
};

