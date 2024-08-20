import { Checkbox, Radio } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

type Props = {
  isMobile: boolean
  isChecked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
} & PropsWithChildren

export const CheckboxOrRadio = ({ isChecked, isMobile, onChange, children }: Props) => {
  return isMobile ? (
    <Radio colorScheme="brand" isChecked={isChecked} onChange={onChange}>
      {children}
    </Radio>
  ) : (
    <Checkbox colorScheme="brand" isChecked={isChecked} onChange={onChange}>
      {children}
    </Checkbox>
  )
}
