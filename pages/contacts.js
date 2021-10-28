import React, { useState, useEffect } from 'react'
import {
    Flex,
    Heading,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Text,
    IconButton,
    Divider,
} from "@chakra-ui/react"
import { AddIcon, DeleteIcon, StarIcon } from "@chakra-ui/icons"
import {
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR,
    AuthAction,
} from 'next-firebase-auth'
import getAbsoluteURL from '../utils/getAbsoluteURL'
import firebase from 'firebase/app'
import 'firebase/firestore'



const Event = () => {
  const AuthUser = useAuthUser()
  const [inputFirstName, setInputFirstName] = useState('')
  const [inputLastName, setInputLastName] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [inputNumber, setInputNumber] = useState('')
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    AuthUser.id &&
      firebase
        .firestore()
        .collection("contacts")
        .where( 'user', '==', AuthUser.id )
        .onSnapshot(
          snapshot => {
            setContacts(
              snapshot.docs.map(
                doc => {
                  return {
                    contactsID: doc.id,
                    contactsFirstName: doc.data().firstName,
                    contactsLastName: doc.data().lastName,
                    contactsEmail: doc.data().email,
                    contactsNumber: doc.data().number
                  }
                }
              )
            );
          }
        )
  })

  const sendData = () => {
    try {
      // try to update doc
      firebase
        .firestore()
        .collection("contacts") // all users will share one collection
        .add({
          firstName: inputFirstName,
          lastName: inputLastName,
          email: inputEmail,
          number: inputNumber
        })
        .then(console.log('Data was successfully sent to cloud firestore!'));
      // flush out the user-entered values in the input elements onscreen
      setInputFirstName('');
      setInputLastName('');
      setInputEmail('');
      setInputNumber('');

    } catch (error) {
      console.log(error)
    }
  }

  const deleteEvent = (t) => {
    try {
      firebase
        .firestore()
        .collection("contacts")
        .doc(t)
        .delete()
        .then(console.log('Data was successfully deleted!'))
    } catch (error) {
      console.log(error)
    }
  }

    return (
      <Flex flexDir="column" maxW={800} align="center" justify="center" minH="100vh" m="auto" px={4}>
        <Flex justify="space-between" w="100%" align="center">
          <Heading mb={4}>Welcome, {AuthUser.email}!</Heading>
          <Flex>
            
            <IconButton ml={2} onClick={AuthUser.signOut} icon={<StarIcon />} />
          </Flex>
        </Flex>

        <InputGroup>
          <InputLeftElement
            pointerContacts="none"
            children={<AddIcon color="gray.300" />}
          />
          <Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="First Name" />
          <Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Last Name" />
          <Input type="text" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="Email" />
          <Input type="text" value={inputNumber} onChange={(e) => setInputNumber(e.target.value)} placeholder="Phone Number" />

          <Button
            ml={2}
            onClick={() => sendData()}
          >
            Add
          </Button>
        </InputGroup>

        {contacts.map((item, i) => {
          return (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Flex
                w="100%"
                p={5}
                my={2}
                align="center"
                borderRadius={5}
                justifyContent="space-between"
              >
                <Flex align="center">
                  <Text fontSize="xl" mr={4}>{i + 1}.</Text>
                  <Text>{item.contactsFirstName}</Text>
                  <Text>... {item.contactsLastName}</Text>
                  <Text>... {item.contactsEmail}</Text>
                  <Text>... {item.contactsNumber}</Text>
                </Flex>
                <IconButton onClick={() => deleteContact(item.eventID)} icon={<DeleteIcon />} />
              </Flex>
            </React.Fragment>
          )
        })}
      </Flex>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  return {
    props: {
    }
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Event)