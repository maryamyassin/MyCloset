import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { deleteUser, User as FirebaseUser } from '@firebase/auth'
import { deleteDoc, doc, getDoc, updateDoc } from '@firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth'

import type { User } from '../lib/types'
import { auth, firestore } from '../lib/firebase'
import UserDetailsEditor from '../components/user-details-editor'

import { Divider, Flex, Heading, VStack } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'

function Settings({ authUser }: { authUser: FirebaseUser }) {
  const [serverUser, setServerUser] = useState<User | null>(null)
  const [clientUser, setClientUser] = useState<User>()
  const [haveChanges, setHaveChanges] = useState(false)

  const [error, setError] = useState<any>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const docRef = doc(firestore, 'users', authUser.uid)
        const resolvedDoc = await getDoc(docRef)
        const data = resolvedDoc.data()

        if (!data) {
          throw Error('attempted to access uninitialized user data')
        }

        data.id = resolvedDoc.id
        setServerUser(data as User)
        setClientUser(data as User)
      } catch (err) {
        console.error(err)
        setServerUser(null)
        setError(err)
      }
    })()
  }, [authUser])

  useEffect(() => {
    if (clientUser && serverUser) {
      setHaveChanges(
        !(
          clientUser.name === serverUser.name &&
          clientUser.age === serverUser.age &&
          clientUser.nationality === serverUser.nationality &&
          clientUser.gender === serverUser.gender &&
          clientUser.languages.length === serverUser.languages.length &&
          clientUser.languages.every(
            (lang, idx) => lang === serverUser.languages[idx],
          )
        ),
      )
    }
  }, [clientUser, serverUser])

  return serverUser && clientUser ? (
    <form
      onSubmit={async e => {
        e.preventDefault()
        const userRef = doc(firestore, 'users', authUser.uid)
        await updateDoc(userRef, clientUser)
        setServerUser(clientUser)
      }}
    >
      <UserDetailsEditor
        user={clientUser}
        onUserChange={newUser => setClientUser(newUser)}
      />
      <Button type="submit" disabled={!haveChanges}>
        Save Changes
      </Button>
    </form>
  ) : error ? (
    <>
      <p>Error while fetching user data:</p>
      <pre>{JSON.stringify(error)}</pre>
    </>
  ) : (
    <p>Loading...</p>
  )
}

export default function SettingsWrapper() {
  const router = useRouter()
  const [authUser, authUserLoading, authUserError] = useAuthState(auth)

  useEffect(() => {
    if (!authUser && !authUserLoading && !authUserError) {
      router.push('/')
    }
  }, [authUser, authUserLoading, authUserError, router])

  return authUser ? (
    <VStack spacing="2rem" align="start">
      <Settings authUser={authUser} />
      <Divider />
      <Heading as="h2" size="sm">
        Account
      </Heading>
      <Flex>
        <Button
          variant="outline"
          marginRight="1.5rem"
          onClick={() => auth.signOut()}
        >
          Sign Out
        </Button>
        <Button
          colorScheme="pink"
          onClick={async () => {
            const userDocRef = doc(firestore, 'users', authUser.uid)
            await deleteDoc(userDocRef)
            await deleteUser(authUser)
            auth.signOut()
            router.push('/')
          }}
        >
          Delete Account
        </Button>
      </Flex>
    </VStack>
  ) : authUserError ? (
    <>
      <p>Error while authenticating:</p>
      <pre>{JSON.stringify(authUserError)}</pre>
    </>
  ) : (
    <p>Loading...</p>
  )
}
