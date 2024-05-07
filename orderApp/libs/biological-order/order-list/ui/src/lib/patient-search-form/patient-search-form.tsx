import { Group, TextInput, Loader, Button } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconCircleCheck, IconAlertCircle } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/* eslint-disable-next-line */
export interface PatientSearchFormProps {
  setIdentifier: (identifier: string) => void;
  patientId?: string;
  isLoading: boolean;
}

export function PatientSearchForm({
  setIdentifier,
  patientId,
  isLoading,
}: PatientSearchFormProps) {
  const [patientIdentifier, setPatientIdentifier] = useInputState<string>('');
  const [found, setFound] = useState(false);
  const [identifierIsCorrect, setIdentifierIsCorrect] = useState(false);

  useEffect(() => {
    if (
      patientIdentifier.match(/^[0-9]{4,5}\/.{2}\/[0-9]{2}\/[0-9]{5}$/g) ||
      patientIdentifier.match(/^[0-9]{4,5}-[0-9]{2}-[0-9]{4}$/g) ||
      patientIdentifier.match(/^[0-9]{4,5}\/.{2}\/[0-9]{2}\/[0-9]{5}E?$/g)
      
    ) {
      setIdentifier(patientIdentifier);
      setIdentifierIsCorrect(true);
    } else if (identifierIsCorrect) {
      setIdentifierIsCorrect(false);
      setIdentifier('');
    }
  }, [identifierIsCorrect, patientIdentifier, setIdentifier]);

  useEffect(() => {
    if (patientId) {
      setFound(true);
    } else if (found) {
      setFound(false);
    }
  }, [found, patientId]);

  return (
    <Group px={'xs'} style={{ width: '40%' }} position={'right'}>
      {identifierIsCorrect &&
        !isLoading &&
        (found ? (
          <IconCircleCheck color="green" />
        ) : (
          <IconAlertCircle color="red" />
        ))}
      {/* {isLoading && <Loader />} */}

      <TextInput
        value={patientIdentifier}
        onChange={setPatientIdentifier}
        placeholder={'Numéro du patient'}
        style={{ width: '50%' }}
      />
      <Link to={`/patient-order/${patientId ? patientId : ''}`}>
        <Button color={'cyan'} disabled={!patientId}>
          Voir le patient
        </Button>
      </Link>
    </Group>
  );
}

export default PatientSearchForm;
