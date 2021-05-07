import React, { useState, useEffect } from 'react';
import { TabContent } from '../../models/Book';
import Editor from 'ckeditor5/build/ckeditor';
import { CKEditor } from "@ckeditor/ckeditor5-react";

type TabConentPageProps = {
  onContentChange: ( data: TabContent ) => void
};

export const TabContentPage: React.FC<TabConentPageProps> = ( {onContentChange}) => {

  const [video, setVideo] = useState< string | undefined>(undefined);
  const [body, setBody] = useState< string >("");
  useEffect( () => {
    onContentChange({
      video: video, 
      body: body,
    });
  }, [body, video]);

  const editorConfiguration = {
    toolbar: [ 'heading','|','bold','italic','underline','link','bulletedList','numberedList', '|','imageUpload','insertTable','mediaEmbed','undo','redo']
  };

  return (
    <div>
      <input 
        type="text"
        placeholder="Enter me"
        onChange={ e => setVideo(e.target.value)}
      />
      <CKEditor
        editor= { Editor }
        config = { editorConfiguration }
        data="<p>Hello from CKEditor 5!</p>"
        onChange= { (event: any, editor: any) => {
          const data = editor.getData();
          setBody(data);
        }}/>
    </div>
  );
};

