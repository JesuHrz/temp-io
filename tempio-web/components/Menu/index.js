import Link from 'next/link'

import styles from 'styles/Menu.module.css'

function Menu () {
  return (
    <nav className={styles['menu']}>
      <ul className={styles['menu__content']}>
        <li className={styles['menu__item']}>
          <Link href='/'>
            <a>
              <span className='material-icons-outlined'>dashboard</span>
            </a>
          </Link>
        </li>
        <li className={styles['menu__item']}>
          <Link href='/devices'>
            <a>
              <span className='material-icons-outlined'>memory</span>
            </a>
          </Link>
        </li>
        <li className={styles['menu__item']}>
          <Link href='/employees'>
            <a>
              <span className='material-icons-outlined'>badge</span>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Menu
