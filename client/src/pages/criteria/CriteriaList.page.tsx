import { Box, Heading, Spinner, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useFetchCriteria } from '../../api/hooks/criteriaQueryHook'
import { PATHS } from '../../util/paths'

export const CriteriaListPage = () => {
  const { isLoading, error, data } = useFetchCriteria()
  if (isLoading) {
    return <Spinner />
  }
  if (error) {
    console.error(error)
    return null
  }
  return (
    <>
      <Heading>Szempontok</Heading>
      {data?.map((c) => (
        <Link to={`${PATHS.CRITERIA}/${c.id}`} key={c.id}>
          <Heading size="sm">{c.name}</Heading>
          <Text>{c.description}</Text>
        </Link>
      ))}
    </>
  )
}
