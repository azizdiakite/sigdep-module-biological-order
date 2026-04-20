/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Checkbox,
  createStyles,
  InputBase,
  NumberInput,
  Radio,
  Select,
  SelectItem,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { EncounterForm } from '@spbogui-openmrs/shared/model';
import { setObs } from '@spbogui-openmrs/shared/utils';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import 'dayjs/locale/fr';
import { IconCalendar, IconClock } from '@tabler/icons';
import InputMask from 'react-input-mask';
import dayjs from 'dayjs';

const obsStyle = createStyles({
  inner: {
    // td: {
    //   margin: 0,
    // },
    '& table': {
      width: '100%',

      border: 1,
    },
    '& tr': {
      width: '100%',
      border: 0,
    },
    '& tbody  tr  td ': {
      padding: 0,
      borderBottom: 0,
    },
  },

});

export interface ObsInputProps {
  currentValue?: any;
  encounter?: EncounterForm;
  concept: string;
  obsGroupConcept?: string;
  uuid?: string;
  placeholder?: string;
  label?: string;
  form: UseFormReturnType<any>;
  name: string;
  type?: 'checkbox' | 'radio' | 'text' | 'date' | 'number' | 'time' | 'select';
  setEncounter?: (encounter: React.SetStateAction<EncounterForm>) => void;
  children?: ReactNode;
  mask?: ReactNode;
  style?: any;
  minDate?: Date;
  maxDate?: Date;
  radioVertical?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: string;
  data?: SelectItem[];
  className?: any;

  // defaultValue?: string | boolean | Date;
}

export function ObsInput({
  concept,
  uuid,
  placeholder,
  obsGroupConcept,
  label,
  form,
  name,
  type,
  children,
  style,
  mask,
  minDate,
  maxDate,
  radioVertical,
  disabled,
  readOnly,
  variant,
  data,
  className
}: // defaultValue,
ObsInputProps) {
  const [innerValue, setInnerValue] = useState<any>(undefined);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const getTime = useCallback((value: Date | string): string => {
    const time = value instanceof Date ? dayjs(value).format('HH:mm') : value;
    // const encounterDate = dayjs(form.values['encounter.encounterDatetime'])
    //   .add(-1, 'd')
    //   .format('YYYY-MM-DD');
    return time;
  }, []);

  // console.log(isChanged);
  const { classes } = obsStyle();

  useEffect(() => {
    if (
      // form.values[name] &&
      // form.values[name] !== '' &&
      // (
    //  isChanged &&
    true
      // (type === 'checkbox' || type === 'radio' || type === 'date')) ||
      //form.values[name] !== innerValue
    ) {
      // console.log(form.values[name]);

      const obsListTemp = setObs(
        type !== 'time' ? form.values[name] : getTime(form.values[name]),
        form.values.encounter.obs,
        concept,
        type,
        obsGroupConcept
      );
      // const obsListTemp = setEncounterObsValue(
      //   type !== 'time' ? form.values[name] : getTime(form.values[name]),
      //   concept,
      //   form.values.encounter.obs,
      //   obsGroupConcept,
      //   uuid,
      //   type
      // );

      // console.log(form.values.encounter.obs);

      // console.log(
      //   'Obs to save',
      //   setObs(
      //     type !== 'time' ? form.values[name] : getTime(form.values[name]),
      //     form.values.encounter.obs,
      //     concept,
      //     type,
      //     obsGroupConcept
      //   )
      // );

      form.setFieldValue('encounter.obs', obsListTemp);
      setIsChanged(false);
      setInnerValue(form.values[name]);
      // console.log('final obs', form.values.encounter.obs);
    }
  }, [
    concept,
    form,
    name,
    obsGroupConcept,
    isChanged,
    type,
    uuid,
    innerValue,
    getTime,
  ]);

  if (type === 'checkbox') {
    return (
      <Checkbox
        label={label}
        {...form.getInputProps(name)}
        disabled={disabled}
        style={style}
        onClick={() => {
          setIsChanged(true);
        }}
        readOnly={readOnly}
        // defaultChecked={defaultValue}
        checked={form.values[name]}
      />
    );
  }

  if (type === 'radio') {
    return (
      <Radio.Group
        label={label}
        name={name}
        {...form.getInputProps(name)}
        disabled={disabled}
        onClick={() => {
          setIsChanged(true);
        }}
        orientation={radioVertical && 'vertical'}
        spacing="xs"
        style={style}
      >
        {children}
      </Radio.Group>
    );
  }

  if (type === 'date') {
    return (
      <DatePicker
        minDate={
          (!!minDate && dayjs(minDate).toDate()) ||
          form.values.encounter?.encounterDatetime
        }
        maxDate={maxDate || new Date()}
        {...form.getInputProps(name)}
        disabled={disabled}
        inputFormat={'DD/MM/YYYY'}
        locale={'fr'}
        style={style}
        onBlurCapture={() => setIsChanged(true)}
        placeholder={placeholder}
        icon={<IconCalendar />}
        readOnly={readOnly}
        className={classes.inner}
        onChangeCapture={() => console.log('changed')}
        variant={variant}
        clearable
      />
    );
  }

  if (type === 'time') {
    return (
      <TimeInput
        label={label}
        disabled={disabled}
        onBlurCapture={() => setIsChanged(true)}
        {...form.getInputProps(name)}
        placeholder={placeholder}
        icon={<IconClock size={16} />}
        variant={variant}
      />
    );
  }

  if (type === 'number') {
    return (
      <NumberInput
        {...form.getInputProps(name)}
        disabled={disabled}
        style={style}
        onClick={() => {
          setInnerValue(form.values[name]);
        }}
        onBlurCapture={() => setIsChanged(true)}
        readOnly={readOnly}
        variant={variant}
        hideControls
      />
    );
  }

  if (type === 'text') {
    return (
      <Textarea
        {...form.getInputProps(name)}
        disabled={disabled}
        style={style}
        onBlurCapture={() => setIsChanged(true)}
        readOnly={readOnly}
        variant={variant}
        styles={style}
        className={className}
      >
        {form.values[name]}
      </Textarea>
    );
  }

  if (mask) {
    return (
      <InputBase
        placeholder={placeholder}
        label={label}
        {...form.getInputProps(name)}
        component={InputMask}
        mask={mask}
        disabled={disabled}
        // onBlur={() => setInnerValue(form.values[name])}
        style={style}
        readOnly={readOnly}
        onClick={() => setInnerValue(form.values[name])}
        maskChar={' '}
        onBlurCapture={() => setIsChanged(true)}
        variant={variant}
      />
    );
  }

  if (type === 'select') {
    return (
      <Select
        placeholder={placeholder}
        // label={label}
        {...form.getInputProps(name)}
        disabled={disabled}
        // onBlur={() => setInnerValue(form.values[name])}
        style={style}
        readOnly={readOnly}
        className={className}
        onClick={() => setInnerValue(form.values[name])}
        onBlurCapture={() => setIsChanged(true)}
        variant={variant}
        data={data}
      />
    );
  }
  // console.log(innerValue);

  return (
    <TextInput
      placeholder={placeholder}
      label={label}
      contentEditable
      // onKeyUp={() => console.log(true)}
      // onBlur={() => setIsChanged(true)}
      // onBlur={() => console.log(true)}
      onBlurCapture={() => setIsChanged(true)}
      // onFocus={setIsChanged(false)}
      onClick={() => setInnerValue(form.values[name])}
      {...form.getInputProps(name)}
      disabled={disabled}
      style={style}
      // tabIndex="-1"
      readOnly={readOnly}
      variant={variant}
    />
  );
}

export default ObsInput;
