// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Axios from 'axios';
import { uploadFileApi } from 'api/userApis';
import { optimizer } from 'components/ImageOptimizer';
import { TFile } from 'interfaces';

class MyUploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(async (file) => {
      try {
        const resizedFile = await optimizer(file);
        // this.cancelTokenSource = Axios.CancelToken.source();
        const [result] = await uploadFileApi(
          resizedFile as TFile,
          this.cancelTokenSource
        );
        console.log(result);
        return { default: result?.url as string };
      } catch (error) {
        console.log(error);
        return error;
      }
    });
  }

  // Aborts the upload process.
  abort() {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new MyUploadAdapter(loader);
  };
}

export default MyCustomUploadAdapterPlugin;
