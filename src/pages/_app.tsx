import type { AppProps } from 'next/app'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Box } from '@chakra-ui/layout'
import { ChakraProvider } from '@chakra-ui/react'

import theme from '../lib/theme'

function Footer({ pathname }: { pathname: string }) {
  return (
    <Box
      bg="white"
      width="100%"
      maxWidth="35rem"
      display="flex"
      justifyContent="space-evenly"
      position="fixed"
      bottom={0}
      left="50%"
      transform="translateX(-50%)"
      sx={{
        a: {
          width: '4rem',
          height: '4rem',
          padding: '0.5rem',
          fontSize: '0.9rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'blue.400',
          borderTop: '0.1rem solid currentColor',
        },

        'a > svg': {
          marginBottom: '0.25rem',
        },

        'a.active': {
          color: 'pink.400',
        },
      }}
    >
      <Link href="/">
        <a className={pathname === '/' ? 'active' : ''}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Home
        </a>
      </Link>
      <Link href="/closet">
        <a className={pathname === '/closet' ? 'active' : ''}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13.5 10.551V9.873C14.3582 9.65053 15.1183 9.14958 15.6612 8.44869C16.2042 7.74779 16.4992 6.88657 16.5 6C16.5 3.794 14.706 2 12.5 2C10.294 2 8.50001 3.794 8.50001 6H10.5C10.5 4.897 11.397 4 12.5 4C13.603 4 14.5 4.897 14.5 6C14.5 7.103 13.603 8 12.5 8C12.2348 8 11.9804 8.10536 11.7929 8.29289C11.6054 8.48043 11.5 8.73478 11.5 9V10.551L2.83501 18.253C2.68409 18.388 2.57767 18.5657 2.52981 18.7624C2.48195 18.9592 2.49489 19.1658 2.56693 19.3551C2.63898 19.5444 2.76673 19.7073 2.93332 19.8225C3.09991 19.9376 3.2975 19.9995 3.50001 20H21.5C21.7027 19.9995 21.9004 19.9376 22.0671 19.8223C22.2337 19.707 22.3615 19.5439 22.4334 19.3545C22.5054 19.165 22.5182 18.9582 22.4701 18.7614C22.422 18.5645 22.3152 18.3869 22.164 18.252L13.5 10.551ZM6.13001 18L12.5 12.338L18.87 18H6.13001Z"  
            />
          </svg>
          Closet
        </a>
      </Link>
      <Link href="/settings">
        <a className={pathname === '/settings' ? 'active' : ''}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </a>
      </Link>
    </Box>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <ChakraProvider theme={theme}>
      <Box margin="2rem" paddingBottom="5rem">
        <Component {...pageProps} />
      </Box>

      {/* trailing slash is important since we are only removing the footer for the group chat pages */}
      {router.pathname && !router.pathname.startsWith('/closet/') && (
        <Footer pathname={router.pathname} />
      )}
    </ChakraProvider>
  )
}

export default MyApp
