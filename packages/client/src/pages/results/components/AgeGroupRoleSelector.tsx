import { FormLabel, useToast, VStack } from '@chakra-ui/react'
import { AgeGroup, ALL_AGE_GROUPS, ALL_ROLES, RatingRole } from '@pontozo/common'
import { MultiSelect } from 'src/components/commons/MultiSelect'
import { translateAgeGroup, translateRole } from 'src/util/enumHelpers'

export type Option<T> = { label: string; value: T }

type Props = {
  selectedAgeGroups: AgeGroup[]
  selectedRoles: RatingRole[]
  onChange: (ageGroups: AgeGroup[], roles: RatingRole[]) => void
}

export const AgeGroupRoleSelector = ({ onChange, selectedAgeGroups, selectedRoles }: Props) => {
  const toast = useToast()

  const showToast = (ageGroup: boolean) => {
    const toastId = 'min-options-reached-warning'
    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        title: ageGroup ? 'Legalább egy korcsoportot ki kell választani' : 'Legalább egy szerepkört ki kell választani',
        status: 'warning',
      })
    }
  }
  const onAgeGroupCheckChange = (option: Option<AgeGroup>) => {
    let newArray = []
    if (selectedAgeGroups.includes(option.value)) {
      if (selectedAgeGroups.length === 1) {
        return showToast(true)
      }
      newArray = selectedAgeGroups.filter((o) => o !== option.value)
    } else {
      newArray = [...selectedAgeGroups, option.value]
    }
    onChange(newArray, ALL_ROLES)
  }

  const onRoleCheckChange = (option: Option<RatingRole>) => {
    let newArray = []
    if (selectedRoles.includes(option.value)) {
      if (selectedRoles.length === 1) {
        return showToast(true)
      }
      newArray = selectedRoles.filter((o) => o !== option.value)
    } else {
      newArray = [...selectedRoles, option.value]
    }
    onChange(ALL_AGE_GROUPS, newArray)
  }

  return (
    <>
      <VStack gap={0.5} alignItems="flex-start" width={['100%', '100%', '33%']}>
        <FormLabel>Korcsoport</FormLabel>
        <MultiSelect
          allText="Mind"
          options={ALL_AGE_GROUPS.map((ag) => ({ label: translateAgeGroup[ag], value: ag }))}
          selected={selectedAgeGroups}
          onChange={onAgeGroupCheckChange}
        />
      </VStack>
      <VStack gap={0.5} alignItems="flex-start" width={['100%', '100%', '33%']}>
        <FormLabel>Szerepkör</FormLabel>
        <MultiSelect
          allText="Mind"
          options={ALL_ROLES.map((r) => ({ label: translateRole[r], value: r }))}
          selected={selectedRoles}
          onChange={onRoleCheckChange}
        />
      </VStack>
    </>
  )
}