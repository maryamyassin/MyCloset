import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { User as FirebaseUser } from '@firebase/auth'
import { arrayUnion, doc } from '@firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, auth, firestore } from '../lib/firebase'
import { Swipe, User } from '../lib/types'

import { getDoc, updateDoc } from 'firebase/firestore'
import {
  Box,
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/layout'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Button } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import { Input } from '@chakra-ui/input'
import { AspectRatio, Progress, Select, StatLabel, Tab, TabList, TabPanel, TabPanels, Tabs, TagLabel } from '@chakra-ui/react'
import UserDetailsEditor from '../components/user-details-editor'
import { get } from '@firebase/database'

function truncate(contents: string, maxChars: number): string {
  if (contents.length > maxChars) {
    return contents.slice(0, maxChars - 3) + '...'
  }

  return contents
}

function closettab(authuser: FirebaseUser) {
   
  async () => {
    const [error, setError] = useState<any>(null)
      try {
        const [user, setUser] = useState<User | null>()
        
  const docRef2 = doc(firestore, 'users', authuser.uid)
        const userDoc = await getDoc(docRef2)
        const userdata = { id: userDoc.id, ...userDoc.data() } as User
        setUser(userdata)
       
    if (!user) return

return (
<>
              <UnorderedList>
                {user.closet.map((clothngitem) => {
                  console.log(clothngitem.link)
                  return (
                    <ListItem key={clothngitem.typetag}>
                      <Image width="100" height="100" src={clothngitem.link} alt={clothngitem.typetag} />
                      <p>{clothngitem.typetag}</p>
                    </ListItem>
                  )
                })}
              </UnorderedList>
            
          </>
        )

              }catch (err) {
  console.error(err)
  setError(err)
}

}
}


function FileUpload({ authUser }: { authUser: FirebaseUser }) {
  const [User, setUser] = useState<User | null>(null)
  const [image, setImage] = useState<any>(null)
  const [url, setUrl] = useState("")
  const [users, setUsers] = useState<User[]>()
  const [progress, setProgress] = useState(0)
  const [closet, setCloset] = useState("")
  const [error, setError] = useState<any>(null)
  const [clothingTag, setClothingTag] = useState<string>()
  let urls: Array<string> = []

  const handleChange = async (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async (e: any) => {

    const storageRef = ref(storage, `Clothes/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      error => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUrl(url)
        })
      }
    )
    const docRef = doc(firestore, 'users', authUser.uid)
    await updateDoc(docRef, {
      closet: arrayUnion({
        link: image.url,
        name: image.name,
        typetag: clothingTag,
        swipes: 0,
      }),
    })
  }

  const uploaded = (e: any) => {
    e.preventDefault()
    useEffect(() => {
      ; (async () => {
        try {
          const docRef2 = doc(firestore, 'users', authUser.uid)
          const userDoc = await getDoc(docRef2)
          const userdata = { id: userDoc.id, ...userDoc.data() } as User
          setUser(userdata) //this is his users thingy
        } catch (err) {
          console.error(err)
          setError(err)
        }
      })()
      uploaded
    }, [User])
  }

    return (
      <>
        <VStack spacing="2rem" align="start">

          <Heading as="h2" size="sm" bgColor="grey.400">
            This is your personal closet
          </Heading>
          <Divider />
          <br />
          <br />
          <Flex
            display="wrap"
            sx={{
              button: {
                top: "1",
              },
              'button > button.text': {
                width: '1rem',
              },
            }}>
            <Input type="file" onChange={handleChange} />
            <br />
            <br />
            <progress value={progress} color="blue.300" max={100} />
            <br />
            <br />
            <Button
              colorScheme="pink"
              onClick={handleUpload}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
              </svg>
              Upload image
            </Button>
            <br />
            <br />
            <Select
              required={true}
              placeholder="What sort of clothing item is this?"
              value={User?.closet[User.closet.length + 1].typetag}
              onChange={e => {
                setClothingTag(e.target.value)
              }
              }
            >
              <option>Shirt</option>
              <option>Bottoms</option>
              <option>Dress</option>
            </Select>
          </Flex>
        </VStack>
      </>
    )
  }



  export default function GroupsWrapper() {
    const router = useRouter()
    const [authUser, authUserLoading, authUserError] = useAuthState(auth)

    useEffect(() => {
      if (!authUser && !authUserLoading && !authUserError) {
        router.push('/')
      }
    }, [authUser, authUserLoading, authUserError, router])

    return authUser ? (
      <>
        <Tabs>
          <TabList>
            <Tab>Add New Items</Tab>
            <Tab>Personal Closet</Tab>
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
              <FileUpload authUser={authUser} />
            </TabPanel>
            <TabPanel>
              <Heading as="h1" size='2xl'>
                myCloset
              </Heading>
              <br />
              <br />
              <Button onClick = {async () => closettab(authUser)}>
                Open my Closet
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    ) : authUserError ? (
      <>
        <p>Error while authenticating:</p>
        <pre>{JSON.stringify(authUserError)}</pre>
      </>
    ) : (
      <p>Loading...</p>
    )
  }

