import { ImageAPI } from './ImageAPI';

type UploadReturn = {
  default: string
};

export class ImageUploadAdapter {
  imageAPI: ImageAPI;
  // eslint-disable-next-line
  loader: any; // CKeditor FileLoader instance

  //eslint-disable-next-line
  constructor(loader: any, token: string) {
    // CKEditor 5's FileLoader instance.
    this.loader = loader;

    this.imageAPI= new ImageAPI(process.env.REACT_APP_BASE_URL || 'http://localhost:8080', token);
  }

  // uploads a image inserted into ckeditor to database
  async upload(): Promise<UploadReturn> {
    const file: File =  await this.loader.file;
    const array = await file.arrayBuffer();
    const url = await this.imageAPI.uploadImage(new Uint8Array(array), file.type);
    return {
      default: url
    };
  }

  // Aborts the upload process.
  abort(): void {
    this.imageAPI.cancel();
  }

}
