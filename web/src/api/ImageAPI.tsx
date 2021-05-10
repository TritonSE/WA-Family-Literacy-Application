import axios, { AxiosInstance } from 'axios';
/* eslint-disable */ 
export class ImageAPI {
    client: AxiosInstance;
    constructor(baseURL:string) {
        this.client = axios.create({baseURL:baseURL});
    }

    async uploadImage(body: Uint8Array, contentType:string): Promise<String> {
        const headers = {
            'Content-Type': contentType
        }
        
        const res = await this.client.post('/images', body, {
            headers:headers
        });
        return res.data
    }   
}