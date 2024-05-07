// import Docxtemplater from 'docxtemplater';
import { Concepts, Gender, initFormValues, siteList, loadFiles } from '@spbogui-openmrs/shared/utils';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { Button, Paper } from '@mantine/core';
import { Encounter, Patient } from '@spbogui-openmrs/shared/model';
import { IconPrinter } from '@tabler/icons';
import dayjs from 'dayjs';
import { useFindLatestObs } from '../../../order-form/src/lib/use-find-latest-obs/use-find-latest-obs';
import { useFindOneLocation } from '@spbogui-openmrs/shared/ui';
import PizZipUtils from 'pizzip/utils';

// import FileViewer from "react-file-viewer";
// import Template from 'assets/inputs-dev.docx';npm install --save react file-saver pizzip docxtemplater docx-pdf

/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderUiOrderPrintProps {
  patient?: Patient;
  encounter?: Encounter;
  disabled?: boolean
}

export function BiologicalOrderPatientOrderUiOrderPrint({
  patient,
  encounter,
  disabled
}: BiologicalOrderPatientOrderUiOrderPrintProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [docs, setDocs] = React.useState<any>([]);
  const [requestDate, setRequestDate] = useState<Date>();

const locuuid = localStorage.getItem('district_uuid') ? localStorage.getItem('district_uuid'): '';
const uuid = locuuid === null ? '' : locuuid
const { location } = useFindOneLocation(uuid);
const district = localStorage.getItem('district') ? localStorage.getItem('district') :'……………………………………………………………………………….';
const codeEtablisement = localStorage.getItem('code') ? localStorage.getItem('code') :'……………………………………………………………………………….';
const site  = localStorage.getItem('site') ? localStorage.getItem('site'): '……………………………………………………………………………….';
const upid  = localStorage.getItem('upid') ? localStorage.getItem('upid'): '……………………………………………………………………………….';
  const DOUBLE_UNDERSCORE = '__';
  const CROSS = 'x';
  const NO_CD4_DATE = '|__|__|/|__|__|/|__|__|__|__|'
  const {
    hasViralLoad, 
    lastViralLaboratoryLoad, 
    lastViralDateLoad, 
    lastViralLoad,
    hivTypeForm,
    antiretroviralPlan,
    initialCd4DateForm,
    arvInitialYear,
    treatmentStartDate,
    treatmentLine,
    arvRegimen,
    initialCd4AbsoluteForm,
    initialCd4PercentageForm,
    initialCd4Percentage,
    initialCd4Absolute,
    grossHivViralLoadTest,
    accessionNumber,
    accessionNumberDateCreated
    
  } = useFindLatestObs(patient ? patient.uuid : '',dayjs(requestDate).format('YYYY-MM-DD'),'');
    
  const pregnancyStatus = encounter?.obs.find((o) => o.concept.uuid === Concepts.PREGNANCY_STATUS);
  const currentlyBreastfeeding = encounter?.obs.find((o) => o.concept.uuid === Concepts.CURRENTLY_BREAST_FEEDING);
  let arvStartDate: Date;

  const prefix = accessionNumber ? accessionNumber.replace(/[^a-zA-Z]/g, '') : '';
  const laboratory   = siteList.find(site => site.code.includes(prefix))?.name || undefined;
  const localPath='./assets/fiche.docx';
  const remotePath = '/openmrs/moduleResources/biologicalorder/assets/fiche.docx';

  const { locationSecond } = useFindOneLocation(uuid);
  let sanitaryRegion = locationSecond !== undefined? locationSecond : undefined ;
  const region = sanitaryRegion !== undefined ? sanitaryRegion.parentLocation?.display: '';
  
  if(initialCd4DateForm){        
    arvStartDate = new Date(initialCd4DateForm);
  }else if(arvInitialYear){
    arvStartDate = new Date(arvInitialYear);
  }else if(treatmentStartDate){
    arvStartDate = new Date(treatmentStartDate);
  }

  const date = new Date(); // Assuming the currenwq-t date and time
  const options: Intl.DateTimeFormatOptions = {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false // Use 24-hour format
  };

 const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

  const generateDocument = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadFiles(remotePath, (error: any, content: any) => {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      
      doc.setData({
        district: district,
        site: site,
        code: codeEtablisement,
        region : region,
        identifier: patient?.identifiers[0]?.identifier,
        upid: upid,
        birthDate: dayjs(patient?.person?.birthdate).format('DD/MM/YYYY'),
        age: patient?.person?.age,
        gender_masc : patient?.person?.gender === Gender.MALE? CROSS : DOUBLE_UNDERSCORE,
        gender_fem : patient?.person?.gender === Gender.FEMALE ? CROSS : DOUBLE_UNDERSCORE,
        vih1: (hivTypeForm?.uuid === Concepts.FORM_VIH_1) ? CROSS : DOUBLE_UNDERSCORE,
        vih2: (hivTypeForm?.uuid === Concepts.FORM_VIH_2) ? CROSS: DOUBLE_UNDERSCORE,
        vih3: (hivTypeForm?.uuid === Concepts.FORM_VIH_1_2) ? CROSS: DOUBLE_UNDERSCORE,
        arvOk : (antiretroviralPlan?.uuid !== Concepts.NONE) ? CROSS: DOUBLE_UNDERSCORE,
        arvNo : (antiretroviralPlan?.uuid === Concepts.NONE) ? CROSS : DOUBLE_UNDERSCORE,
        arvStart: arvStartDate ? dayjs(arvStartDate).format('DD/MM/YYYY') : '|__|__|__|__|',
        arvRegimen : arvRegimen ? arvRegimen?.name?.display: '',
        line1: (treatmentLine?.display === initFormValues.FIRST_LINE_DESCRIPTION) ? CROSS : DOUBLE_UNDERSCORE,
        line2: (treatmentLine?.display === initFormValues.SECOND_LINE_DESCRIPTION) ? CROSS : DOUBLE_UNDERSCORE,
        line3: (treatmentLine?.display === initFormValues.THIRD_LINE_DESCRIPTION) ? CROSS : DOUBLE_UNDERSCORE,
        hvl: (grossHivViralLoadTest !== undefined) ? CROSS : DOUBLE_UNDERSCORE,
        hnvl : (grossHivViralLoadTest === undefined)? CROSS : DOUBLE_UNDERSCORE,
        lab : laboratory ? laboratory: '…………………',
        value : grossHivViralLoadTest ? grossHivViralLoadTest: '……………………',
        lastDate : accessionNumberDateCreated ? dayjs(accessionNumberDateCreated).format('DD/MM/YYYY') :'……………',
        preg : (pregnancyStatus?.value?.uuid === Concepts.YES) ? CROSS: DOUBLE_UNDERSCORE,
        feed:  (currentlyBreastfeeding?.value?.uuid === Concepts.YES) ? CROSS: DOUBLE_UNDERSCORE,
        printDate : formattedDate,
        icd4c : initialCd4AbsoluteForm ? initialCd4AbsoluteForm : '……………………',
        icd4p : initialCd4PercentageForm ? initialCd4PercentageForm : '……………………',
        icd4d : initialCd4DateForm ?  dayjs(lastViralDateLoad).format('DD/MM/YYYY') : NO_CD4_DATE,
        lcd4c : initialCd4Absolute === undefined ?  initialCd4AbsoluteForm  : initialCd4Absolute,
        lcd4p : initialCd4Percentage === undefined ? initialCd4PercentageForm : initialCd4Percentage,
        lcd4d : initialCd4DateForm ?  dayjs(lastViralDateLoad).format('DD/MM/YYYY') : NO_CD4_DATE,
      });
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render(); 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any…………………
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

      ///  console.log(JSON.stringify({ error: error }, replaceErrors));

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
          compression: "DEFLATE"
        }); //Output the document using Data-URI
        // setDocs([{ uri: out }]);
        // printBlobAsWord(out);
        saveAs(out, 'FICHE_DEMANDE_CV'+formattedDate+'.docx');
      }
    });
  };

  async function printBlobAsWord(blob: any): Promise<void> {
    // Create a Blob URL from the Blob object
    const blobUrl = URL.createObjectURL(blob);

    // Open the print dialog with the Blob URL as the source
    const printWindow = window.open("", "Print");
    printWindow?.addEventListener("beforeunload", (event) => {
      event.returnValue = "";
    });
    const printHtml = `<html> <body>
        <embed src="${blobUrl}" width="100%" height="100%" type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"></embed>
      </body>
    </html>`;
    printWindow?.document.write(printHtml);
    printWindow?.print();
  
    // Revoke the Blob URL to free up memory
    URL.revokeObjectURL(blobUrl);
  }

  return (
    <Paper >
      {/* <h1>Welcome to BiologicalOrderPatientOrderUiOrderPrint!</h1> */}
     {/* <Text size={'md'} color={'cyan.7'} weight={'bold'} m={'xs'}>
      {JSON.stringify(currentlyBreastfeeding)}
        Impression de la demande
  </Text> */ }
     {/* <Divider />
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
*/}
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
      {/*JSON.stringify(grossHivViralLoadTest)*/}
      <Button 
        leftIcon={<IconPrinter />}
        color={'cyan'}
        disabled={disabled}
        onClick={() => generateDocument()}>
            Générer la fiche de demande
      </Button>
          
    </Paper>
  );
}

export default BiologicalOrderPatientOrderUiOrderPrint;
