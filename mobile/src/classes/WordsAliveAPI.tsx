import axios, { AxiosInstance } from 'axios';
import { Book } from '../models/Book';

// Class to encapsulate the handler for the Words Alive API
class WordsAliveAPI {
    client: AxiosInstance;

    constructor(baseURL: string) {
      this.client = axios.create({ baseURL: baseURL });
    }

    async getBooks(): Promise<Book[]> {
      const res = await this.client.get('/books');
      return res.data;
    }
}

export { WordsAliveAPI };
