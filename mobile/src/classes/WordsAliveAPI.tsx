import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Book } from '../models/Book';

class WordsAliveAPI {
    client: AxiosInstance;

    constructor(baseURL: string) {
      this.client = axios.create({ baseURL: baseURL });
    }

    async getBooks(): Promise<Book[]> {
      try {
      const res = await this.client.get('/books');
      console.log("res");
      console.log(res.data);
      return res.data;
      } catch(err) {
        console.log(err);
      }
    }
}

export { WordsAliveAPI };
