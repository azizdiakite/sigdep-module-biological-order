import { Link, Route, Routes, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import invariant from 'invariant';
import {
  useFindEncounter,
  useSaveEncounter
} from '@spbogui-openmrs/shared/ui';
import dayjs from 'dayjs';
import {
  customEncounterParams ,Concepts, EncounterType, EncounterRole
} from '@spbogui-openmrs/shared/utils';
import {
  Text,
  Table,
} from '@mantine/core';
import { ENCOUNTER_INITIAL_VALUES, EncounterForm } from '@spbogui-openmrs/shared/model';

/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderUiOrderResultProps {}

export function BiologicalOrderPatientOrderUiOrderResult(
  props: BiologicalOrderPatientOrderUiOrderResultProps
) {
  const { patientId ,requestId } = useParams();
  invariant(patientId, '');
  invariant(requestId, '');

  const ENCOUNTER_INITIAL_VALUE_FORM: EncounterForm =  {
    ...ENCOUNTER_INITIAL_VALUES,
    encounterProviders: [
      { encounterRole: EncounterRole.CLINICIAN, provider: '738185ba-eac9-11e5-8f4d-e06995eac916' },
      { encounterRole: EncounterRole.COLLECTOR, provider: '738185ba-eac9-11e5-8f4d-e06995eac916' },
    ],
  };


  const form = ENCOUNTER_INITIAL_VALUE_FORM;

  const {encounter} = useFindEncounter(requestId ,customEncounterParams ,true);

  const obs = encounter?.obs.find((o) => o.concept.uuid === Concepts.HIV_VIRAL_LOAD_TEST);
  const hivType = encounter?.obs.find((o) => o.concept.uuid === Concepts.TYPE_VIH); 
 
/*  useEffect(() => {
      // 👇️ only runs once   
      const valueObs = obs ? obs.value : 0;

      if(obs && obs.value != undefined){
        const hivResult = encounter?.obs.find((o) => o.value === obs.value);
        console.log({hivResult: hivResult});
        
        if (hivResult !== undefined) {

          const Obs1  = {
            concept :'164596AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            value : valueObs,
            groupMembers : [],
          }
  
          const Obs2  = {
            concept :'1305AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            value :  valueObs >= 20 ? '1301AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':'1306AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            groupMembers : [],
          }
          
          form.obs.push(Obs1);
          form.obs.push(Obs2);
          console.log({form: form});
          saveEncounter(form, {
          onSuccess: (data) => {
            console.log('Saved successfully Encounter');
            console.log({data: data});
          },
          onError: (error, variables, context) => {
            console.log({returnError: error});
          },
        });
        }

    }
    }, []); // 👈️ empty dependencies array  7707/01/19/00027
 
  useEffect(() => {
  } ,[patientId ,requestId])
*/
  return (
    <div>
      <h1>Résultats de la demande</h1>
      {/*{JSON.stringify(encounter)}*/}

      {obs ? (
        <div>
           <Text size={"md"} pb={"xs"} pl={'xs'}>Labno :{" "}</Text>

         <Table>
            <tbody>
              <tr>
                <td>
                  <Text size={"md"} pb={"xs"}>Date de réception :{" "}</Text>
                </td>
                <td>
                  <Text size={"md"} pb={"xs"}>
                  Date de Prélèvement : {" "}
                  {!!encounter?.encounterDatetime && dayjs(encounter?.encounterDatetime).format('DD/MM/YYYY')}
                  </Text>
                </td>
              </tr>
              <tr>
                <td> <Text size={"md"} pb={"xs"}>Date de réalisation :{" "}</Text></td>
                <td> <Text size={"md"} pb={"xs"}>Date de Validation :{" "}</Text></td>
              </tr>
            </tbody>
          </Table>
 
          <Table striped>
            <thead>
              <tr>
                <th>Virologie</th>
                <th>Résultat nombre de copies</th>
                <th>Résultats Log /ml</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {hivType
                    ? hivType.display.split(":",2)[1]
                    : ""}
                </td>
                <td>{obs ? obs.value : ""}</td>
                <td>
                  {obs && (Math.log(obs.value) / Math.log(10)).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      ) : (
        <p>Aucune valeur.</p>
      )}
      {/*   <Text size={'xl'} pb={'xs'}>
        {obs?obs.value +" cp /ml": "Aucune valeur Oui"}
       </Text>
       <Text size={'sm'} pb={'xs'}>
        <i>{ obs && "Log : "+(Math.log(obs.value) / Math.log(10)).toFixed(2)}</i>
  </Text> */}
    </div>
  );
}

export default BiologicalOrderPatientOrderUiOrderResult;
