import { Group, Button } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useInputState } from '@mantine/hooks';
import { IconCalendar, IconSearch } from '@tabler/icons';
import dayjs from 'dayjs';
import { useEffect } from 'react';

/* eslint-disable-next-line */
export interface OrderListFilterFormProps {
  setParams: (period: string) => void;
  setStartDate : (startDate : string) => void;
  setEndDate : (endDate : string) => void;
}

export function OrderListFilterForm({ setParams,setStartDate ,setEndDate}: OrderListFilterFormProps) {
  const [startPeriod, setStartPeriod] = useInputState<Date | null>(null);
  const [endPeriod, setEndPeriod] = useInputState<Date | null>(null);

  useEffect(() => {
    if (!startPeriod || !endPeriod) {
      setParams('');
    }
    setEndDate(dayjs(endPeriod).format('YYYY-MM-DD'));
    setStartDate(dayjs(startPeriod).format('YYYY-MM-DD'))
  }, [startPeriod, endPeriod, setParams ,setStartDate ,setEndDate]);
  return (
    <Group p={'xs'} position={'right'}>
      <DatePicker
        locale="fr"
        inputFormat={'DD/MM/YYYY'}
        placeholder="Date de début"
        icon={<IconCalendar />}
        value={startPeriod}
        onChange={setStartPeriod}
      />
      <DatePicker
        locale="fr"
        inputFormat={'DD/MM/YYYY'}
        placeholder="Date de fin"
        icon={<IconCalendar />}
        value={endPeriod}
        onChange={setEndPeriod}
      />
      <Button
        variant={'subtle'}
        onClick={() =>  {
          setParams(
            startPeriod && endPeriod
              ? `_lastUpdated=ge${dayjs(startPeriod).format(
                  'YYYY-MM-DD'
                )}&_lastUpdated=le${dayjs(endPeriod).format('YYYY-MM-DD')}`
              : ''
          ) ;
          setStartDate(startPeriod?dayjs(startPeriod).format('YYYY-MM-DD'):'0001-01-01');
          setEndDate(endPeriod?dayjs(endPeriod).format('YYYY-MM-DD'):'9999-12-31')
           }
        }
      >
        <IconSearch />
      </Button>
    </Group>
  );
}

export default OrderListFilterForm;
