import { Heading, Select } from '@chakra-ui/react'
import { useState } from 'react'
import { User, UserRole } from '../../api/model/user'

export const UraCreatePage = () => {
  const [user, setUser] = useState<User>()
  const [role, setRole] = useState<UserRole>()
  return (
    <>
      <Heading>Felhasználó kinevezése</Heading>
      <Select placeholder="Válassz szerepkört!" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
        <option value={UserRole.COACH}>Edző</option>
        <option value={UserRole.JURY}>MTFSZ Zsűri</option>
        <option value={UserRole.SITE_ADMIN}>Admin</option>
      </Select>
    </>
  )
}
