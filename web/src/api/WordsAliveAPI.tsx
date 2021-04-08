import axios, { AxiosInstance } from 'axios';
import { Book, BookDetails } from '../models/Book';
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
    // const res = await this.client.delete(`/books/${id}/${lang}`);
    const res = await this.client.delete(`/books/${id}`);
    return res.data;
  }

  // deletes a book by id and language
  async deleteBookByLang(id: string, lang: Language): Promise<BookDetails> {
    // const res = await this.client.delete(`/books/${id}/${lang}`);
    const res = await this.client.delete(`/books/${id}/${lang}`);
    return res.data;
  }
}

export { WordsAliveAPI };
