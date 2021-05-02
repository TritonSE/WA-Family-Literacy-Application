import React, { useState, useEffect } from 'react';
import { TabContent } from '../../models/Book';

type TabConentPageProps = {
  onContentChange: ( data: TabContent ) => boolean
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

  return (
    <div>
      <input 
        type="text"
        placeholder="Enter me"
        onChange={ e => setVideo(e.target.value)}
      />
      <input
        type="text"
        placeholder='Enter me p3'
        onChange={ e => setBody(e.target.value)}
      />
    </div>
  );
};

