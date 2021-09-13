import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import classNames from 'classnames'
import { useAtom } from 'jotai'

import Menu from 'components/Menu'
import Avatar from 'components/Avatar'
import { hasNotificationsAtom } from 'atoms'

import styles from 'styles/Layout.module.css'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const API_URL = `${DOMAIN}/api/logout`

function Layout ({ title = '', userName, children }) {
  const router = useRouter()
  const [hasNotifications] = useAtom(hasNotificationsAtom)

  const handleLogout = async (e) => {
    e.preventDefault()

    try {
      await axios.post(API_URL)
      router.push('/sign-in')
    } catch (e) {
      console.error('Error:', e)
    }
  }

  return (
    <main className={styles['layout']}>
      <div className={styles['layout__navigation']}>
        <span className={classNames('material-icons-outlined', styles['layout__icon'])}>
          storm
        </span>
        <Menu />
      </div>
      <div className={styles['layout__container']}>
        <div className={styles['layout__header']}>
          { title && (<h1 className={styles['layout__title']}>{title}</h1>) }
          <Avatar name={userName} showNotificacion={hasNotifications}>
            <Link href='/notifications'>
              <a>Notificaciónes</a>
            </Link>
            <a onClick={handleLogout}>Cerrar sesión</a>
          </Avatar>
        </div>
        <div className={styles['layout__content']}>
          { children }
        </div>
      </div>
    </main>
  )
}

export default Layout
