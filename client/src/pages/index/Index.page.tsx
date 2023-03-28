import { Button, Heading, Input } from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PATHS } from '../../util/paths'

export const IndexPage = () => {
  const [name, setName] = useState('John')
  const onGetClick = async () => {
    const res = await axios.get('/GetCriteria')
    console.log(res)
  }

  const onPostClick = async () => {
    const res = await axios.post('/CreateCriteria', { name })
    console.log(res)
  }
  return (
    <>
      <Heading>Pontoz-O</Heading>
      <Button colorScheme="green" onClick={onGetClick}>
        GET
      </Button>
      <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Button colorScheme="orange" onClick={onPostClick}>
        POST
      </Button>
      <Button as={Link} to={PATHS.CRITERIA}>
        Admin oldal
      </Button>
    </>
  )
}
