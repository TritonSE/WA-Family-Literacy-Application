import { TabContent } from './TabContent';

export type Book = {
    'id': string
    'title': string
    'image'?: string
    'read'?: TabContent
    'explore'?: TabContent
    'learn'?: TabContent
    'created_at': string

};
