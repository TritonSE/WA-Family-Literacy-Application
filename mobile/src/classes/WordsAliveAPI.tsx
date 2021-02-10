import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Book } from '../models/Book';

class WordsAliveAPI {
    client: AxiosInstance;

    constructor(baseURL: string) {
      this.client = axios.create({ baseURL: baseURL });
    }

    async getBooks(): Promise<AxiosResponse<Book[]>> {
      return this.client.get('/books');
    }
}

export { WordsAliveAPI };
