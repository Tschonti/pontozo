import { EmailRecipient, PontozoError, UpdateEmailRecipient } from '@pontozo/common'
import { useMutation } from '@tanstack/react-query'
import { functionAxios } from 'src/util/axiosConfig'

export const useUpdateEmailPreferencesMutation = () => {
  return useMutation<unknown, PontozoError, UpdateEmailRecipient>(
    async (formData) => (await functionAxios.patch(`/emails/mine`, formData)).data
  )
}

export const useOptOutEmailPreferencesMutation = () => {
  return useMutation<unknown, PontozoError>(async () => (await functionAxios.patch(`/emails/optOut`)).data)
}

export const useFetchEmailPreferencesMutation = () => {
  return useMutation<EmailRecipient, PontozoError>(async () => (await functionAxios.get(`/emails/mine`)).data)
}
