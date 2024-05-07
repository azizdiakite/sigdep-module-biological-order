import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';

export function loadFile(url: any, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
}

export const loadFiles = (url: string, callback: (error: any, content: any) => void) => {
  fetch(url)
      .then(response => response.blob())
      .then(blob => {
          const reader = new FileReader();
          reader.onload = (event) => {
              callback(null, event.target?.result);
          };
          reader.onerror = (event) => {
              callback(event.target?.error, null);
          };
          reader.readAsArrayBuffer(blob);
      })
      .catch(error => {
          callback(error, null);
      });
};

export const generateDocument = (uri: string) => {
  loadFiles(uri, (error: any, content: any) => {
    if (error) {
      throw error;
    }
    console.log(content);

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.setData({
      first_name: 'John',
      last_name: 'Doe',
      phone: '0652455478',
      description: 'New Website',
    });

    // console.log('doc', doc);

    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();
      console.log(
        'doc returned',
        doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
      );
    } catch (error: any) {
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
      const replaceErrors = (key: any, value: any) => {
        if (value instanceof Error) {
          return Object.getOwnPropertyNames(value).reduce((error, key) => {
            // error[key] = value[key];
            return error;
          }, {});
        }
        return value;
      };
      //   console.log(JSON.stringify({ error: error }, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map((error: { properties: { explanation: any } }) => {
            return error.properties.explanation;
          })
          .join('\n');
        console.log('errorMessages', errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }

    doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  });
};
