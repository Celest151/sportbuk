import { CaretDown, Check } from '@phosphor-icons/react'
import * as Select from '@radix-ui/react-select'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  id: string
  value: string
  options: SelectOption[]
  onValueChange: (value: string) => void
  ariaLabel?: string
}

const EMPTY_VALUE = '__sportbuk_empty__'

export function SelectField({ id, value, options, onValueChange, ariaLabel }: SelectFieldProps) {
  return (
    <Select.Root
      value={value || EMPTY_VALUE}
      onValueChange={(nextValue) => onValueChange(nextValue === EMPTY_VALUE ? '' : nextValue)}
    >
      <Select.Trigger className="select-trigger" id={id} type="button" aria-label={ariaLabel}>
        <Select.Value />
        <Select.Icon asChild>
          <CaretDown className="select-caret" size={18} weight="bold" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="select-content" position="popper" sideOffset={7} collisionPadding={16}>
          <Select.Viewport className="select-viewport">
            {options.map((option) => (
              <Select.Item className="select-item" value={option.value || EMPTY_VALUE} key={option.value || EMPTY_VALUE}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="select-indicator">
                  <Check size={17} weight="bold" aria-hidden="true" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
