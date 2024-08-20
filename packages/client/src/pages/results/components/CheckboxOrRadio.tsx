import { Checkbox, Radio } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

type Props = {
  isMobile: boolean
  isChecked: boolean
  onDesktopChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onMobileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
} & PropsWithChildren

export const CheckboxOrRadio = ({ isChecked, isMobile, onDesktopChange, onMobileChange, children }: Props) => {
  return isMobile ? (
    <Radio colorScheme="brand" isChecked={isChecked} onChange={isMobile ? onMobileChange : onDesktopChange}>
      {children}
    </Radio>
  ) : (
    <Checkbox colorScheme="brand" isChecked={isChecked} onChange={isMobile ? onMobileChange : onDesktopChange}>
      {children}
    </Checkbox>
  )
}
