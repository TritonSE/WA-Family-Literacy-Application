import axios, { AxiosInstance } from 'axios';

import { Book, BookDetails } from '../models/Book';
import { Language } from '../models/Languages';
import { User, UpdateUser } from '../models/User';

// Class to encapsulate the handler for the Words Alive API
class WordsAliveAPI {
  client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL: baseURL });
  }

  // Set the Firebase token for future API calls
  setToken(token: string): void {
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
  }

  // Unset the Firebase token
  clearToken(): void {
    delete this.client.defaults.headers.Authorization;
  }

  // Pings the backend to wake it up if asleep. Does not throw or return anything
  ping(): void {
    this.client.get('/ping').catch(() => {});
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

  // returns an individual book by id to determine if its favorited
  async getBookFavorite(id: string): Promise<Book> {
    const res = await this.client.get(`/books/${id}`);
    return res.data;
  }

  // gets all books favorited by a user
  async getFavorites(): Promise<Book[]> {
    const res = await this.client.get('/books/favorites');
    return res.data;
  }

  // favorites a book
  async favoriteBook(id: string): Promise<void> {
    await this.client.put(`/books/favorites/${id}`);
    return;
  }

  // unfavorite a book
  async unfavoriteBook(id: string): Promise<void> {
    await this.client.delete(`/books/favorites/${id}`);
    return;
  } 

  async getUser(id: string): Promise<User> {
    const res = await this.client.get(`/users/${id}`);
    return res.data;
  }

  async createUser(user: User): Promise<User> {
    const res = await this.client.post('/users', user);
    return res.data;
  }

  async updateUser(id: string, update: UpdateUser): Promise<User> {
    const res = await this.client.patch(`/users/${id}`, update);
    return res.data;
  }

  async incrementClicks(id: string): Promise<void> {
    await this.client.put(`/analytics/${id}/inc`, '', {headers: {}});
  }

  // Returns book array of top 5 most clicked books
  async getPopularBooks(): Promise<Book[]> {
    const res = await this.client.get('/books/popular');
    return res.data;
  }
}

export { WordsAliveAPI };
