import { BiologicalOrderOrderListUi } from '@spbogui-openmrs/biological-order/order-list/ui';
import { useEffect, useState } from 'react';
import { useFindAllEncounters } from '@spbogui-openmrs/shared/ui';
import { EncounterType } from '@spbogui-openmrs/shared/utils';
import { customEncounterParams } from '@spbogui-openmrs/shared/utils';

/* eslint-disable-next-line */
export interface BiologicalOrderOrderListFeatureProps {}

export function BiologicalOrderOrderListFeature(
  props: BiologicalOrderOrderListFeatureProps
) {
  const [identifier, setIdentifier] = useState<string | undefined>();
  const [patientId, setPatientId] = useState('');
  const [startDate, setStartDate] = useState('0001-01-01');
  const [endDate, setEndDate] = useState('9999-12-31');
  const [params, setParams] = useState('');

  const filterList = (startDate: Date, endDate: Date) => {
    console.log(startDate, endDate);
  };

  const {encounters } = useFindAllEncounters(EncounterType.REQUEST_EXAM ,startDate ,endDate ,customEncounterParams ,'' ,true)

  useEffect(() => {
    if (identifier && !patientId) {
      setPatientId(identifier);
    }
  }, [identifier, patientId]);

  useEffect(() => {
    setEndDate(endDate);
    setStartDate(startDate);
  }, [startDate, endDate]);

  return (
    <div>
      <BiologicalOrderOrderListUi
        orders={encounters}
        setFilterList={filterList}
        setIdentifier={setIdentifier}
        patientId={patientId}
        setParams={setParams}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </div>
  );
}

export default BiologicalOrderOrderListFeature;
