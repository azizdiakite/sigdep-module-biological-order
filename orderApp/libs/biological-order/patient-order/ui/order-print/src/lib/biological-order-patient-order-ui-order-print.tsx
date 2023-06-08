// import Docxtemplater from 'docxtemplater';
import { loadFile } from '@spbogui-openmrs/shared/utils';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import React, { useEffect, useState } from 'react';
import DocViewer, {
  DocViewerRenderers,
  MSDocRenderer,
  HTMLRenderer,
} from 'react-doc-viewer';
import { saveAs } from 'file-saver';
import { Button, Divider, Group, Paper, Text } from '@mantine/core';
import { Patient } from '@spbogui-openmrs/shared/model';
import { DatePicker } from '@mantine/dates';
import { IconCalendar, IconFile } from '@tabler/icons';
// import FileViewer from "react-file-viewer";
// import Template from 'assets/inputs-dev.docx';

/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderUiOrderPrintProps {
  patient?: Patient;
}

export function BiologicalOrderPatientOrderUiOrderPrint({
  patient,
}: BiologicalOrderPatientOrderUiOrderPrintProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [docs, setDocs] = React.useState<any>([]);
  const [requestDate, setRequestDate] = useState<Date>();

  const generateDocument = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadFile('./assets/inputs-dev.docx', (error: any, content: any) => {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      doc.setData({
        first_name: 'a',
        last_name: 'Doe',
        phone: '0652455478',
      });
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const replaceErrors = (key: any, value: any) => {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce((error, key) => {
              // error[key] = value[key];
              return error;
            }, {});
          }
          return value;
        };

        console.log(JSON.stringify({ error: error }, replaceErrors));

        if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors
            .map((error: any) => {
              return error.properties.explanation;
            })
            .join('\n');
          console.log('errorMessages', errorMessages);
          // errorMessages is a humanly readable message looking like this :
          // 'The tag beginning with "foobar" is unopened'
        }
        throw error;
      } finally {
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }); //Output the document using Data-URI
        // setDocs([{ uri: out }]);
        saveAs(out, 'output.docx');
      }
    });
  };

  // console.log(docs);

  // useEffect(() => {
  //   return () => {
  //     generateDocument();
  //   };
  // }, []);

  return (
    <Paper withBorder>
      {/* <h1>Welcome to BiologicalOrderPatientOrderUiOrderPrint!</h1> */}
      <Text size={'md'} color={'cyan.7'} weight={'bold'} m={'xs'}>
        Impression de la demande
      </Text>
      <Divider />
      <Paper m={'xs'}>
        <Group>
          <DatePicker
            icon={<IconCalendar />}
            inputFormat={'DD/MM/YYYY'}
            locale={'fr'}
            placeholder={'Date de la demande'}
          />
          <Button leftIcon={<IconFile />} onClick={() => generateDocument()}>
            Générer la demande
          </Button>
        </Group>
      </Paper>

      {/* <DocViewer
        pluginRenderers={[MSDocRenderer, HTMLRenderer]}
        documents={docs}
      /> */}
      {/* <FileViewer
        fileType={type}
        filePath={file}
        errorComponent={CustomErrorComponent}
        onError={onError}
      /> */}
    </Paper>
  );
}

export default BiologicalOrderPatientOrderUiOrderPrint;
