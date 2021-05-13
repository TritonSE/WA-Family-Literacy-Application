import axios, { AxiosInstance, AxiosRequestConfig, CancelTokenSource } from 'axios';
/* eslint-disable */ 
export class ImageAPI {
    client: AxiosInstance;
    cancelToken: CancelTokenSource;
    constructor(baseURL:string) {
        this.client = axios.create({baseURL:baseURL});
        this.cancelToken = axios.CancelToken.source();
    }

    async uploadImage(body: Uint8Array, contentType:string): Promise<String> {
        const headers = {
            'Content-Type': contentType
        }
        

        const requestConfig:AxiosRequestConfig  = {
            headers: headers,
            cancelToken: this.cancelToken.token
        }
        
        const res = await this.client.post('/images', body, requestConfig);
        return res.data
    } 

    cancel():void {
        this.cancelToken.cancel();
    }
}