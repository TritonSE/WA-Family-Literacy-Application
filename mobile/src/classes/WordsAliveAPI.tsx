import axios, { AxiosInstance } from 'axios';
import { Book } from '../models/Book';

class WordsAliveAPI {
    client: AxiosInstance;

    constructor(baseURL: string) {
      this.client = axios.create({ baseURL: baseURL });
    }

    async getBooks(): Promise<Book[]> {
      const res = await this.client.get('/books');
      return res.data;
    }

    changeURL(newURL: string): void {
      this.client = axios.create({ baseURL: newURL });
    }
}

export { WordsAliveAPI };
