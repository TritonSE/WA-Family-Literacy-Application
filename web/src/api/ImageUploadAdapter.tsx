// import FileReader from '@ckeditor/ckeditor5-upload/src/filereader';
import { ImageAPI } from '../api/ImageAPI';
/* eslint-disable */ 
export class ImageUploadAdapter {
    imageAPI : ImageAPI;
    loader: any


    constructor( loader:any) {
        // CKEditor 5's FileLoader instance.
        this.loader = loader;

        this.imageAPI= new ImageAPI( process.env.REACT_APP_BASE_URL || 'http://localhost:8080')
    }


    async upload() {
        const file:File =  await this.loader.file;
        const array = await file.arrayBuffer();
        const url = await this.imageAPI.uploadImage(new Uint8Array(array), file.type);
        return {
            default: url
        }
    }

    // Aborts the upload process.
    abort() {
        this.imageAPI.cancel();
    }

}