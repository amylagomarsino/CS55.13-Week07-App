import React from 'react'
import '../styles/globals.css'
import initAuth from '../utils/initAuth'
import { ChakraProvider } from "@chakra-ui/react" // <- add this

initAuth()

function MyApp({ Component, pageProps }) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <ChakraProvider> // <- add this
      <Component {...pageProps} />
    </ChakraProvider> // <- add this
  )
}

export default MyApp
