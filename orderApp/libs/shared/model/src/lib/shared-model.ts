import { SelectItem } from '@mantine/core';

export function sharedModel(): string {
  return 'shared-model';
}
export interface LocationListItem {
  item: SelectItem;
  itemChildren: LocationListItem[];
}
