import axios, { AxiosInstance } from 'axios';
import { Book } from '../models/Book';

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
    async getBook(id: string, lang: string): Promise<Book> {
      const res = await this.client.get(`/books/${id}/${lang}`);
      return res.data;
    }
}

export { WordsAliveAPI };
