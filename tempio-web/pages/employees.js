import Head from 'next/head'
import Image from 'next/image'
import { useAtom } from 'jotai'

import Layout from 'components/Layout'

import withSession from 'libs/session'
import { decodeToken } from 'libs/jwt'
import { useSocket } from 'hooks'
import { writeHasNotificationsAtom } from 'atoms'

import styles from '../styles/Home.module.css'

function Employees ({ organization }) {
  const [_, setHasNotifications] = useAtom(writeHasNotificationsAtom)

  useSocket(organization.id, {
    onMessage: (topic) => {
      switch (topic) {
        case 'agent/notification':
          setHasNotifications(true)
          break
      }
    }
  })

  return (
    <Layout
      title='Dashboard'
      userName={organization.name}
    >
      <Head>
        <title>Dashboard | TempIO</title>
        <meta name="description" content="TempIO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles['dashboard']}>
        <div className={styles['dashboard__poster']}>
          <Image
            src='/coming-soon.png'
            alt='Coming Soon'
            width={350}
            height={300}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Employees

export const getServerSideProps = withSession(async function ({ req, res }) {
  const token = req.session.get('token')

  if (!token) {
    res.setHeader('location', '/sign-in')
    res.statusCode = 302
    res.end()

    return { props: {} }
  }

  const decodedToken = decodeToken(token)

  return {
    props: {
      token,
      organization: decodedToken
    }
  }
})
