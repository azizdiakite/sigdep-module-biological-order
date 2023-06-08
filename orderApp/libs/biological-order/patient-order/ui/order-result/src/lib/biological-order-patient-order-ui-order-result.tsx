import { Link, Route, Routes, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import invariant from 'invariant';
import {
  useFindEncounter
} from '@spbogui-openmrs/shared/ui';

import {
  customEncounterParams ,Concepts
} from '@spbogui-openmrs/shared/utils';

/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderUiOrderResultProps {}

export function BiologicalOrderPatientOrderUiOrderResult(
  props: BiologicalOrderPatientOrderUiOrderResultProps
) {
  const { patientId ,requestId } = useParams();
  invariant(patientId, '');
  invariant(requestId, '');

  const {encounter} = useFindEncounter(requestId ,customEncounterParams ,true);

  const obs = encounter?.obs.find((o) => o.concept.uuid === Concepts.HIV_VIRAL_LOAD_TEST);
  useEffect(() => {
    console.log(requestId)
  } ,[patientId ,requestId])

  return (
    <div>
      <h1>Résultats de la commande</h1>
      {obs?obs.value: "Aucune valeur Oui"}
    </div>
  );
}

export default BiologicalOrderPatientOrderUiOrderResult;
