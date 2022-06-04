import Head from 'next/head'
import { FC } from 'react'

type LayoutProps = {
  title: string
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/Users/mongol/dev/company-library/public/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  )
}

export default Layout