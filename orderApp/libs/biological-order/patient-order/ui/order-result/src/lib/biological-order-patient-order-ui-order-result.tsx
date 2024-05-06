import { useParams } from 'react-router-dom';
import invariant from 'invariant';
import {
  useFindEncounter} from '@spbogui-openmrs/shared/ui';
import dayjs from 'dayjs';
import {
  customEncounterParams ,Concepts, EncounterRole, FulfillerStatus
} from '@spbogui-openmrs/shared/utils';
import {
  Text,
  Table,
  Group,
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

//  const form = ENCOUNTER_INITIAL_VALUE_FORM;
  const {encounter} = useFindEncounter(requestId ,customEncounterParams ,true);
  const obs = encounter?.obs.find((o) => o.concept.uuid === Concepts.GROSS_HIV_VIRAL_LOAD);
  const isRejected = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.EXCEPTION  && encounter?.orders[0]?.fulfillerComment !== FulfillerStatus.CANCELLED
  const isReceived = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.RECEIVED
  const isCompleted = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.COMPLETED
  const isCancelled = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.EXCEPTION && encounter?.orders[0]?.fulfillerComment === FulfillerStatus.CANCELLED

   //console.log({obs: obs, isCompleted: isCompleted});
    
  const hivType = encounter?.obs.find((o) => o?.concept?.uuid === Concepts.TYPE_VIH); 
  let isDoubleValue: boolean = false;
  isDoubleValue = !isNaN(parseFloat(obs?.value)); 

  function getAlternativeMessage(){
   return isRejected
    ? encounter?.orders[0]?.fulfillerComment
    :isReceived
    ? "L'echantillon est en cours de traitement."
    :isCancelled
    ? "La demande a été annulée."
    : 'Aucune valeur.';
  }
 
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

      {obs && isCompleted ? (
        <div>
          <Group mb={'xs'}>
           <Text size={"md"} pl={'xs'} >Labno :</Text>
            <Text weight={'bold'}>{encounter?.orders[0].accessionNumber}</Text>
          </Group>
         
         <Table>
            <tbody>
              <tr></tr>
              <tr>
                <td>
                  <Group>
                    <Text size={"md"}>Date de réception :{" "}</Text>
                    <Text weight={'bold'} size={"md"}>  {!!encounter?.orders[0].dateActivated && dayjs(encounter?.orders[0].dateActivated).format('DD/MM/YYYY')}</Text>
                  </Group>
                </td>
                <td>
                  <Group>
                   <Text size={"md"} > Date de Prélèvement : {" "} </Text>
                   <Text weight={'bold'} size={"md"}>  {!!encounter?.encounterDatetime && dayjs(encounter?.encounterDatetime).format('DD/MM/YYYY')}</Text>
                  </Group>
                </td>
              </tr>
              <tr>{/*
                <td> <Text size={"md"} pb={"xs"}>Date de réalisation :{" "}</Text></td>
                <td> <Text size={"md"} pb={"xs"}>Date de Validation :{" "}</Text></td>*/}
              </tr>
            </tbody>
          </Table>
 
          <Table striped mt={'xs'}>
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
                  <Text weight={'bold'}>
                  {hivType
                    ? hivType.display.split(":",2)[1]
                    : ""}
                  </Text>
                </td>
                <td>
                  <Text weight={'bold'}>
                      {obs ? obs.value : ""}
                  </Text>
                </td>
                <td>
                  <Text weight={'bold'}>
                    {isDoubleValue ? (Math.log(obs.value) / Math.log(10)).toFixed(2): ''  }
                  </Text>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      ) : (
        <p>{getAlternativeMessage()}</p>
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
