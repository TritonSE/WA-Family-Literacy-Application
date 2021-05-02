import React from 'react';
import { TabContent } from '../models/Book';
import { TabContentPage } from './BookWizard/TabContentPage';

export const BookWizardPage: React.FC = () => {

  const temp = ( data: TabContent): boolean => {
    console.log(data.body);
    console.log(data.video);
    return true;
  };


  return (
    <div>
      <TabContentPage onContentChange= {temp}>
      </TabContentPage>
    </div>
  );

};