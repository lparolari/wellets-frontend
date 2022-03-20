import {
  GroupBase,
  Props as SelectProps,
  Select as BaseSelect,
} from 'chakra-react-select';
import React from 'react';

export interface IOption {
  value: string;
  label: string;
}

const AdvancedSelect = <
  Option extends IOption = IOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: SelectProps<Option, IsMulti, Group>,
) => <BaseSelect<Option, IsMulti, Group> {...props} />;

export default AdvancedSelect;
