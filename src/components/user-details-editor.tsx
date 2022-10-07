import type { User } from '../lib/types'

import { Box } from '@chakra-ui/layout'
import { Input } from '@chakra-ui/input'
import { Select } from '@chakra-ui/select'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { useEffect, useState } from 'react'

function NationalityEditor({
  nationality,
  onNationalityChange,
}: {
  nationality: string
  onNationalityChange: (newNationality: string) => void
}) {
  const [nationalityList, setNationalityList] = useState<string[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch(
        'https://trial.mobiscroll.com/content/countries.json',
      )
      const countryList = await res.json()
      setNationalityList(
        countryList.map((country: { text: string }) => country.text),
      )
    })()
  }, [])

  return (
    <Select
      value={nationality}
      onChange={e => onNationalityChange(e.target.value)}
    >
      {nationalityList.map(country => (
        <option key={country}>{country}</option>
      ))}
    </Select>
  )
}

export default function UserDetailsEditor({
  user,
  onUserChange,
}: {
  user: User
  onUserChange: (newUser: User) => void
}) {
  return (
    <Box
      sx={{
        '.chakra-form-control': {
          margin: '1.5rem 0',
        },
      }}
    >
      <FormControl>
        <FormLabel fontSize="small">Name</FormLabel>
        <Input
          type="text"
          required={true}
          placeholder="Your Name..."
          value={user.name}
          onChange={e => onUserChange({ ...user, name: e.target.value })}
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="small">Age</FormLabel>
        <Input
          type="number"
          required={true}
          placeholder="Your Age..."
          value={user.age || ''}
          onChange={e =>
            onUserChange({
              ...user,
              age: parseInt(e.target.value),
            })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="small">Nationality</FormLabel>
        <NationalityEditor
          nationality={user.nationality}
          onNationalityChange={newNationality =>
            onUserChange({
              ...user,
              nationality: newNationality,
            })
          }
        />
      </FormControl>
  
      <FormControl>
        <FormLabel fontSize="small">Gender</FormLabel>
        <Select
          
          required={true}
          placeholder="Your Gender..."
          value={user.gender}
          onChange={e =>
            onUserChange({
              ...user,
              gender: e.target.value,
            })
          }
        >
          <option>Male</option>
          <option>Female</option>
          <option>Prefer Not to Say</option>
        </Select>
      </FormControl>

      {/* TODO: editing the languages will be a bit more involved */}
    </Box>
  )
}

