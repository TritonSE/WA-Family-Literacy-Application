import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Book, BookDetails, TabContent } from '../models/Book';
import { Language } from '../models/Languages';

// Class to encapsulate the handler for the Words Alive API
class WordsAliveAPI {
  client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL: baseURL });
  }

  // makes a call to the database and returns an array of all books
  async getBooks(): Promise<Book[]> {
    const res = await this.client.get('/books');
    return res.data;
  }

  // returns an individual book by id
  async getBook(id: string, lang: Language): Promise<BookDetails> {
    const res = await this.client.get(`/books/${id}/${lang}`);
    return res.data;
  }

  // deletes all versions of a book by id
  async deleteBook(id: string): Promise<BookDetails> {
    const res = await this.client.delete(`/books/${id}`);
    return res.data;
  }

  // deletes a book by id and language
  async deleteBookByLang(id: string, lang: Language): Promise<BookDetails> {
    const res = await this.client.delete(`/books/${id}/${lang}`);
    return res.data;
  }

  // uploads a book into the databsase, returning the book
  async uploadBook(title: string, author: string, image: string): Promise<Book> {
    const requestConfig: AxiosRequestConfig  = {
      headers: {
        'Content-Type': 'application/json'
      },
    };
    const res = await this.client.post('/books', {
      title:title, 
      author:author,
      image:image
    }, requestConfig);

    return res.data;
  }

  // uploads all of the details of a book and its language by the id of the book
  async uploadBookDetails(id: string, lang: string, readTabContent: TabContent, exploreTabContent: TabContent, learnTabContent: TabContent): Promise<BookDetails> {
    const requestConfig: AxiosRequestConfig  = {
      headers: {
        'Content-Type': 'application/json'
      },
    };

    const res = await this.client.post(`/books/${id}`, {
      lang: lang, 
      read: readTabContent, 
      explore:exploreTabContent, 
      learn:learnTabContent
    }, requestConfig);

    return res.data;


  }
}

export { WordsAliveAPI };
