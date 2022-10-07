import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: 'Phenomena, sans-serif', 
    body: 'Roboto, sans-serif',
  },
  styles: {
    global: {
      body: {
        maxWidth: '30rem',
        marginX: 'auto',
        bg: 'pink.50',
        color: 'blue.400',
      },
    },
  },
})

export default theme
