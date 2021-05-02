import React, { useState, useEffect, useContext } from 'react';

type TabConentPageProps = {
  onContentChange: (TabContentModel)=> {},
}

export const TabContentPage: React.FC<TabConentPageProps> = ( {onContentChange}) => {

  const [video, setVideo] = useState< string | null>(null);
  const [body, setBody] = useState< string >("");
  useEffect( () => {
    onContentChange({
      video: video, 
      body: body,
    })
  }, [body, video])
  return (





  )


}

