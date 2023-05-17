import { FormLabel, Heading, Select } from '@chakra-ui/react'
import { useState } from 'react'
import { User, UserRole } from '../../api/model/user'
import { UserSelector } from './components/UserSelector'

export const UraCreatePage = () => {
  const [user, setUser] = useState<User>()
  const [role, setRole] = useState<UserRole>()

  return (
    <>
      <Heading>Felhasználó kinevezése</Heading>
      <UserSelector setUser={setUser} user={user} />

      <FormLabel>Szerepkör</FormLabel>
      <Select placeholder="Válassz szerepkört!" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
        <option value={UserRole.COACH}>Edző</option>
        <option value={UserRole.JURY}>MTFSZ Zsűri</option>
        <option value={UserRole.SITE_ADMIN}>Admin</option>
      </Select>
    </>
  )
}
