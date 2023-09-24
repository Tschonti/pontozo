import { Helmet } from 'react-helmet'

type Props = {
  title: string
}

export const HelmetTitle = ({ title }: Props) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}
