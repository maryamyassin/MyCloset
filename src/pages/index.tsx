import { useAuthState } from 'react-firebase-hooks/auth'

import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@firebase/auth'
import { auth, firestore, storage } from '../lib/firebase'
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@firebase/firestore'
import { User, Swipe } from '../lib/types'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/layout'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Button } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import { Input } from '@chakra-ui/input'
import {
  AspectRatio,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  TabList,
  Divider,
} from '@chakra-ui/react'

import UserDetailsEditor from '../components/user-details-editor'
import { FirebaseError } from '@firebase/util'


function getPredictedShirtEventIndex(shirts: { link: string; name: string; typetag: string; swipes: number }[], user: User): number {
  // TODO: AI Stuff
  let indexOfFavShirtItems: Array<{ link: string; name: string; typetag: string; swipes: number}> = []
  let shirtlikes = user.swipeHistory.filter(e => e.swipe === 1) //shirts that the user has liked

  for (let i = 0; i<shirtlikes.length; i++){ 
    // This id could be any other chosen ID
      let fs = shirts.filter(e => e.link === shirtlikes[i].shirteventId)
      indexOfFavShirtItems.push(fs[i])
    } 
  

    if (indexOfFavShirtItems.length == 0) {
      return Math.floor(Math.random() * shirts.length) //return random
    } else {
      return Math.floor(Math.random() * indexOfFavShirtItems.slice(0, shirts.length).length) //return random from likes
    }
}


function getPredictedBottomEventIndex(bottoms: { link: string; name: string; typetag: string; swipes: number}[], user: User): number {
  // TODO: AI Stuff
  let indexOfFavBottomsItems: Array<{ link: string; name: string; typetag: string; swipes: number}> = []
  let bottomslikes = user.swipeHistory.filter(e => e.swipe === 1) //bottoms that the user has liked
  
  for (let i = 0; i<bottomslikes.length; i++){  //length of the longer one
  let fb = bottoms.filter(e => e.link === bottomslikes[i].bottomeventId)
  indexOfFavBottomsItems.push(fb[i])
  } 
    
  if (indexOfFavBottomsItems.length == 0) {
    return Math.floor(Math.random() * bottoms.length) //return random
  } else {
    return Math.floor(Math.random() * indexOfFavBottomsItems.slice(0, bottoms.length).length) //return random from likes
  }
}


/**
 *   
 * @param 
 * @returns 
 */

function EventViewer({ user }: { user: FirebaseUser }) {
  const [currentuser, setUser] = useState<User | null>(null)
  const [currentShirtEventIdx, setCurrentShirtEventIdx] = useState<number>(0)
  const [currentBottomEventIdx, setCurrentBottomEventIdx] = useState<number>(0)
  const [error, setError] = useState<any>(null)
  const [shirtItems, setshirtItems] = useState<{ link: string; name: string; typetag: string; swipes: number}[] | null>()
  const [bottomsItems, setbottomsItems] = useState<{ link: string; name: string; typetag: string; swipes: number }[] | null>()
  const [dressItems, setdressItems] = useState<{ link: string; name: string; typetag: string }[] | null>()
 
  useEffect(() => {
    ; (async () => {
      try {

        const userDocRef = doc(firestore, 'users', user.uid) //get user data using uid and initialize the user object using the data retrieved
        console.log("id:", user.uid)
        const userDoc = await getDoc(userDocRef)
        const userdata = { id: userDoc.id, ...userDoc.data() } as User
        setUser(userdata)

        if (!currentuser) return

        setshirtItems(currentuser.closet.filter(e => e.typetag == "Shirt")) // closet items that are shirts
        setbottomsItems(currentuser.closet.filter(e => e.typetag == "Bottoms")) // closet items that are bottoms
        setdressItems(currentuser.closet.filter(e => e.typetag == "Dress")) // closet items that are dresses

        if (!shirtItems) return
        if (!bottomsItems) return

        setCurrentShirtEventIdx(getPredictedShirtEventIndex(shirtItems, currentuser)) //current predicted event id set using user data
        setCurrentBottomEventIdx(getPredictedBottomEventIndex(bottomsItems, currentuser))

      } catch (err) {
        console.error(err)
        setError(err)
      }
    })()
  }, [user])

  
  const updateCurrentEvent = (swipe: Swipe) => {

    
    if (currentuser !== null) { 
        ; (async () => {

          if (swipe == 1){
            alert("Outfit has been added to your favorites!")
          }      

          const userDocRef = doc(firestore, 'users', user.uid)
          await updateDoc(userDocRef, {
            swipeHistory: arrayUnion({
              shirteventId: currentuser.closet.filter(e => e.typetag == "Shirt")[currentShirtEventIdx].link,
              bottomeventId: currentuser.closet.filter(e => e.typetag == "Bottoms")[currentBottomEventIdx].link, //the item links to compare the swipes
              swipe,
            }),
          })
        })()
      /**   const eventDocRef = doc(firestore, 'events', events[currentEventIdx].id)
      await updateDoc(eventDocRef, {
        swipes: arrayUnion({ userId: user.uid, swipe }),
      }) */

      setshirtItems(currentuser.closet.filter(e => e.typetag == "Shirt").filter((_, i) => i !== currentShirtEventIdx))  //returns closet shirt objects where currentidx is not i
      setbottomsItems(currentuser.closet.filter(e => e.typetag == "Bottoms").filter((_, i) => i !== currentBottomEventIdx))

      if (!shirtItems) return
      if (!bottomsItems) return

      setCurrentShirtEventIdx(getPredictedShirtEventIndex(shirtItems, currentuser))
      setCurrentBottomEventIdx(getPredictedBottomEventIndex(bottomsItems, currentuser))
    }
  }

  return currentuser !== null && currentuser?.closet.filter(e => e.typetag == "Shirt") !== null && currentuser?.closet.filter(e => e.typetag == "Bottoms") !== null && currentuser?.closet.filter(e => e.typetag == "Shirt").length !== 0 && currentuser?.closet.filter(e => e.typetag == "Bottoms").length !== 0 && currentuser?.closet.filter(e => e.typetag == "Shirt")[currentShirtEventIdx] && currentuser?.closet.filter(e => e.typetag == "Bottoms")[currentBottomEventIdx] ? (
    <>
      <Heading as="h1" size="xl" bgColor="grey.400">
        Hi {currentuser.name}! 
        <br />
      </Heading>
      <Heading as="h2" size="md" bgColor="grey.400">
      Here is an outfit idea for today!
      </Heading>
      <Divider />
      <Box
        display="wrap"
        sx={{
          button: {
            marginRight: "2.25rem",
          },
          'button > button.text': {
            width: '1rem',
          },
        }}
      >
        <Button
          colorScheme="pink"
          variant = "outline"
          onClick={() => updateCurrentEvent(Swipe.Right)}
        >
          Love it ! 
        </Button>
        <br />
        <br />
        <Button
          colorScheme="grey"
          variant = "outline"
          onClick={async () => updateCurrentEvent(Swipe.Left)}>
            Show me something else
        </Button>
      </Box>
     <Box width="100%" alignItems="center">
        <AspectRatio width="47.5%" ratio={1}>
          <Image
            src={currentuser?.closet.filter(e => e.typetag == "Shirt")[currentShirtEventIdx].link}
            objectFit="cover"
            border = '1px'
            borderColor = 'black'
            alt=""
          />
        </AspectRatio>
        <AspectRatio width="47.5%" top="1" ratio={1}>
          <Image
            src={currentuser?.closet.filter(e => e.typetag == "Bottoms")[currentBottomEventIdx].link}
            objectFit="cover"
            border = '1px'
            borderColor = 'black'
            alt=""
          />
        </AspectRatio>
      </Box>
      
    </>
  ) : shirtItems !== null && shirtItems?.length === 0 ? (
    <p>No more shirts to show you</p>
  ) : bottomsItems !== null && bottomsItems?.length === 0 ? (
    <p>No more bottoms to show you</p>
  ) : error ? (
    <>
      <p>Error while fetching clothing data:</p>
      <pre>{JSON.stringify(error)}</pre>
    </>
  ) : (
    <p>Loading...</p>
  )
}

function SignIn() {
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')

  const [error, setError] = useState('')

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!error) {
          try {
            await signInWithEmailAndPassword(auth, inputEmail, inputPassword)
          } catch (err) {
            if (err instanceof FirebaseError) {
              setError(err.message)
            }
          }
        }
      }}
    >
      <FormControl marginTop="2rem">
        <FormLabel fontSize="small">Username or Email</FormLabel>
        <Input
          type="email"
          required={true}
          value={inputEmail}
          onChange={e => {
            setInputEmail(e.target.value)
            setError('')
          }}
          placeholder="person@mailprovider.com"
        />
      </FormControl>

      <FormControl marginTop="1rem">
        <FormLabel fontSize="small">Password</FormLabel>
        <Input
          type="password"
          required={true}
          value={inputPassword}
          onChange={e => {
            setInputPassword(e.target.value)
            setError('')
          }}
          placeholder="************"
        />
      </FormControl>

      {error && <Text color="red.300">{error}</Text>}

      <Button type="submit" variant="outline" marginTop="1.5rem" bgColor='white'>
        Sign In
      </Button>
    </form>
  )
}

function SignUp() {
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [error, setError] = useState('')

  type UserDetails = Omit<User, 'id' | 'groups' | 'swipeHistory' | 'closet'>
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    age: 0,
    gender: '',
    nationality: '',
    languages: ['English'],
  })

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        console.log(inputEmail, inputPassword)
        if (!error) {
          try {
            const cred = await createUserWithEmailAndPassword(
              auth,
              inputEmail,
              inputPassword,
            )

            let docRef = doc(firestore, 'users', cred.user.uid)
            await setDoc(docRef, {
              id: cred.user.uid,
              name: userDetails.name,
              age: userDetails.age,
              nationality: userDetails.nationality,
              //location: userDetails.location,
              gender: userDetails.gender,
              languages: ['English'],
              groups: [],
              swipeHistory: [],
              closet: [],
            } as User)

            setError('')
          } catch (err) {
            if (err instanceof FirebaseError) {
              console.log(err.code, err.message)
              setError(err.message)
            }
          }
        }
      }}
    >
      <FormControl marginTop="2rem" >
        
        <FormLabel fontSize="small">Username or Email</FormLabel>
        <Input
          type="email"
          required={true}
          value={inputEmail}
          onChange={e => {
            setInputEmail(e.target.value)
            setError('')
          }}
          placeholder="person@mailprovider.com"
        />
      </FormControl>

      <FormControl marginTop="1rem">
        <FormLabel fontSize="small">Password</FormLabel>
        <Input 
          type="password"
          required={true}
          value={inputPassword}
          onChange={e => {
            setInputPassword(e.target.value)
            setError('')
          }}
          placeholder="************"
        />
      </FormControl>

      <UserDetailsEditor
        user={userDetails as User} // since the ignored properties don't matter to `UserDetailsEditor`
        onUserChange={newUser => {
          setUserDetails(newUser)
          setError('')
        }}
      />

      {error && <Text color="red.300">{error}</Text>}

      <Button type="submit" variant="outline" marginTop="1.5rem" bgColor='white'>
        Sign Up
      </Button>
    </form>
  )
}

function AuthForm() {
  return (
    <Tabs>
      <TabList>
        <Tab>Sign In</Tab>
        <Tab>Sign Up</Tab>
      </TabList>

      <TabPanels
        sx={{
          '.chakra-input': {
            maxWidth: '20rem',
          },
        }}
      >
        <TabPanel>
        <Heading as="h1" size='2xl'>
          myCloset
        </Heading>
          <SignIn />
        </TabPanel>
        <TabPanel>
        <Heading as="h1" size='2xl'>
          myCloset
        </Heading>
          <SignUp />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default function Home() {
  const [user, loading, error] = useAuthState(auth)

  return (
    <VStack spacing="1rem" align="start">
      {user ? (
        <EventViewer user={user} />
      ) : error ? (
        <>
          <h1>Oh no! We&apos;ve had an error:</h1>
          <pre>{JSON.stringify(error)}</pre>
        </>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <AuthForm />
      )}
    </VStack>
  )
}
