import { Box, Checkbox, HStack, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { Option } from '../../pages/results/components/AgeGroupRoleSelector'

type Props<T> = {
  allText: string
  options: Option<T>[]
  selected: T[]
  onChange: (option: Option<T>) => void
}

export const MultiSelect = <T extends string | number | boolean | object>({ allText, options, onChange, selected }: Props<T>) => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const selectRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('click', onOutsideClicked)
    return () => document.removeEventListener('click', onOutsideClicked)
  })

  const onSelectClicked = () => {
    onToggle()
    selectRef.current?.focus()
  }

  const onOutsideClicked = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as HTMLElement) && isOpen) onClose()
  }
  return (
    <Box w="100%" ref={containerRef} cursor="default">
      <HStack
        justify="space-between"
        w="100%"
        bg="white"
        borderColor="#e2e8f0"
        _hover={{ borderColor: '#CBD5E0' }}
        padding="7px 12px 7px 16px"
        borderRadius="6px"
        borderWidth="1px"
        ref={selectRef}
        onClick={onSelectClicked}
        tabIndex={0}
        _focus={{ borderColor: '#3182ce', borderWidth: '2px', padding: '6px 11px 6px 15px' }}
      >
        <Text>
          {selected.length === options.length
            ? allText
            : options
                .filter((o) => selected.includes(o.value))
                .map((s) => s.label)
                .join(', ')}
        </Text>
        <FaChevronDown color="#1a202c" size="11px" />
      </HStack>
      {isOpen && (
        <VStack
          boxShadow="2xl"
          alignItems="flex-start"
          w={containerRef.current?.clientWidth}
          pos="absolute"
          top={(selectRef.current?.offsetTop ?? 0) + 40}
          bg="white"
          borderRadius="6px"
          borderWidth="1px"
          borderColor="#e2e8f0"
          px="12px"
          py="4px"
          zIndex={3}
        >
          {options.map((o) => (
            <Checkbox colorScheme="brand" key={o.value.toString()} isChecked={selected.includes(o.value)} onChange={() => onChange(o)}>
              {o.label}
            </Checkbox>
          ))}
        </VStack>
      )}
    </Box>
  )
}
