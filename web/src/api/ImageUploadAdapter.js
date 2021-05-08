// import FileReader from '@ckeditor/ckeditor5-upload/src/filereader';
import { ImageAPI } from '../api/ImageAPI';
/* eslint-disable */ 
export class MyUploadAdapter {

    constructor( loader) {
        // CKEditor 5's FileLoader instance.
        this.loader = loader;

        this.imageAPI = new ImageAPI('http://localhost:8080')

        // URL where to send files.
        this.url = 'http://localhost:8080/image';
    }

    // Starts the upload process.
    upload() {

        return new Promise( ( resolve, reject ) => {
            this._initRequest();
            this._initListeners( resolve, reject );
            this._sendRequest();
        } );
    }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }

    // Example implementation using XMLHttpRequest.
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        xhr.open( 'POST', this.url, true );
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners( resolve, reject ) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = 'Couldn\'t upload file:' + ` ${ loader.file.name }.`;

        xhr.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr.addEventListener( 'abort', () => reject() );
        xhr.addEventListener( 'load', () => {
            let response = xhr.response;
            response = response.replace('"', '')
            response = response.replace('"', '')
            console.log(response)

            if ( response == "error" ) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }
            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            resolve( 
            {
                default: response
            } );
        } );

        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }

    // Prepares the data and sends the request.
    _sendRequest() {
        this.xhr.setRequestHeader("Content-Type", "image/png");
        this.loader.file.then((file, reject) => {
            file.arrayBuffer().then(array => {
                const uintArray = new Uint8Array(array)
                this.xhr.send(uintArray);
            })
        })
        
    }
}