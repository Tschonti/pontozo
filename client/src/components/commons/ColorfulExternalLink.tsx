import { Link } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

type Props = {
  url: string
  hoverColor: string
  centered?: boolean
} & PropsWithChildren

export const ColorfulExternalLink = ({ url, hoverColor, children, centered = false }: Props) => {
  return (
    <Link isExternal href={url} _hover={{ color: hoverColor }} textAlign={centered ? 'center' : undefined}>
      {children}
    </Link>
  )
}
