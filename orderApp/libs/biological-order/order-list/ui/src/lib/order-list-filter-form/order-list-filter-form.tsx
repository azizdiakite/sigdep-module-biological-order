import { Group, Button, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useInputState } from '@mantine/hooks';
import { IconCalendar, IconSearch, IconX } from '@tabler/icons';
import dayjs from 'dayjs';
import { useEffect } from 'react';

/* eslint-disable-next-line */
export interface OrderListFilterFormProps {
  setParams: (period: string) => void;
  setStartDate : (startDate : string) => void;
  setEndDate : (endDate : string) => void;
}

export function OrderListFilterForm({ setParams, setStartDate, setEndDate }: OrderListFilterFormProps) {
  const [startPeriod, setStartPeriod] = useInputState<Date | null>(null);
  const [endPeriod, setEndPeriod] = useInputState<Date | null>(null);

  useEffect(() => {
    if (!startPeriod || !endPeriod) {
      setParams('');
    }
    setEndDate(dayjs(endPeriod).format('YYYY-MM-DD'));
    setStartDate(dayjs(startPeriod).format('YYYY-MM-DD'));
  }, [startPeriod, endPeriod, setParams, setStartDate, setEndDate]);

  const handleReset = () => {
    setStartPeriod(null);
    setEndPeriod(null);
    setParams('');
    setStartDate('0001-01-01');
    setEndDate('9999-12-31');
  };

  return (
    <Group p={'xs'} position={'left'} align="flex-end" spacing={'sm'}>
      <DatePicker
        locale="fr"
        inputFormat={'DD/MM/YYYY'}
        placeholder="Date de début"
        label={<Text size="xs" color="dimmed">Du</Text>}
        icon={<IconCalendar size={16} />}
        value={startPeriod}
        onChange={setStartPeriod}
        clearable
      />
      <DatePicker
        locale="fr"
        inputFormat={'DD/MM/YYYY'}
        placeholder="Date de fin"
        label={<Text size="xs" color="dimmed">Au</Text>}
        icon={<IconCalendar size={16} />}
        value={endPeriod}
        onChange={setEndPeriod}
        clearable
        minDate={startPeriod ?? undefined}
      />
      <Button
        color="cyan"
        leftIcon={<IconSearch size={16} />}
        disabled={!startPeriod || !endPeriod}
        onClick={() => {
          setParams(
            startPeriod && endPeriod
              ? `_lastUpdated=ge${dayjs(startPeriod).format('YYYY-MM-DD')}&_lastUpdated=le${dayjs(endPeriod).format('YYYY-MM-DD')}`
              : ''
          );
          setStartDate(startPeriod ? dayjs(startPeriod).format('YYYY-MM-DD') : '0001-01-01');
          setEndDate(endPeriod ? dayjs(endPeriod).format('YYYY-MM-DD') : '9999-12-31');
        }}
      >
        Rechercher
      </Button>
      {(startPeriod || endPeriod) && (
        <Button variant="subtle" color="gray" leftIcon={<IconX size={14} />} onClick={handleReset}>
          Réinitialiser
        </Button>
      )}
    </Group>
  );
}

export default OrderListFilterForm;
