import { Box, Button, Heading, HStack, Image, Link, Text, VStack } from '@chakra-ui/react'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'
import { ColorfulExternalLink } from 'src/components/commons/ColorfulExternalLink'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'

export const ImpressumPage = () => {
  return (
    <VStack marginLeft="auto" marginRight="auto" width={500}>
      <HelmetTitle title="Pontoz-O | Impresszum" />
      <Image width={250} height={250} src="/img/samu.jpg" rounded="100%" />
      <Box>
        <Text textAlign="center">Az oldalt fejlesztette:</Text>
        <Heading fontSize={50} transform="auto" skewX={-10} style={{ fontVariant: 'small-caps' }}>
          Fekete Sámuel
        </Heading>
      </Box>
      <HStack>
        <ColorfulExternalLink url="https://github.com/Tschonti/" hoverColor="brand.500">
          <FaGithub size={25} />
        </ColorfulExternalLink>
        <ColorfulExternalLink url="mailto:feketesamu@gmail.com" hoverColor="brand.500">
          <FaEnvelope size={25} />
        </ColorfulExternalLink>
        <ColorfulExternalLink url="https://www.linkedin.com/in/samuel-fekete/" hoverColor="brand.500">
          <FaLinkedin size={25} />
        </ColorfulExternalLink>
        <a
          style={{
            display: 'flex',
            backgroundColor: '#FC5200',
            color: '#fff',
            padding: '6px 10px 6px 30px',
            fontSize: '11px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '10px center',
            borderRadius: '3px',
            backgroundImage: "url('https://badges.strava.com/logo-strava-echelon.png')",
          }}
          href="https://strava.com/athletes/445408"
          target="_clean"
        >
          <Text pt={0.4}>Follow me on</Text>
          <img
            src="https://badges.strava.com/logo-strava.png"
            alt="Strava"
            style={{ marginLeft: '2px', verticalAlign: 'text-bottom' }}
            height="13px"
            width="51px"
          />
        </a>
      </HStack>

      <Text textAlign="justify">
        Az alkalmazást az MTFSZ felkérése fejlesztettem a szabadidőmben. Hibajelentésekkel, fejlesztési ötletekkel bátran keressetek
        emailben. A projekt volt a fő témája a BME mérnökinformatikus alapképzésre beadott szakdolgozatomnak, melyet{' '}
        <Link color="brand.500" isExternal href="/szakdolgozat.pdf">
          innen letölthettek
        </Link>
        . Az alkalmazást ez után is fejlesztettem, optimalizáltam.
      </Text>
      <Text textAlign="justify">
        Az alkalmazás teljes mértékben nyílt forráskódú. A backend REST API-ja Azure serverless Function-ökből áll, a felhasználói felület
        Reactben készült. Amennyiben érdekel a projekt és esetleg szívesen segítenél, keress emailen!
      </Text>
      <Button
        onClick={() => window.open('https://github.com/Tschonti/pontozo', '_blank', 'noopener,noreferrer')}
        colorScheme="brand"
        leftIcon={<FaGithub />}
        aria-label="GitHub repository"
      >
        GitHub repository
      </Button>
    </VStack>
  )
}
