import { useState } from 'react'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'

import styles from 'styles/Avatar.module.css'

function Avatar ({ name = '', children, showNotificacion }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={styles['avatar']}>
      <a
        className={styles['avatar__content']}
        data-tip
        data-for='avatar-tooltip'
        data-event='click'
      >
        <span
          className={
            classNames('material-icons-outlined', styles['avatar__avatar-icon'])
          }
        >
          account_circle
        </span>
        <span className={styles['avatar__name']}>
          {name}
          {
            showNotificacion && (
              <span class="material-icons-outlined">
                notifications_active
              </span>
            )
          }
        </span>
        <span
          className={
            classNames(
              'material-icons-outlined',
              styles['avatar__down-icon'],
              { [styles['avatar__down-icon--open']]: isOpen }
            )
          }
        >
          keyboard_arrow_down
        </span>
      </a>
      <ReactTooltip
        id='avatar-tooltip'
        place='bottom'
        type='dark'
        effect='solid'
        globalEventOff='click'
        offset={{'top': 6, 'left': 0}}
        className={classNames(styles['avatar__tooltip'], styles['place-bottom'])}
        afterShow={() => setIsOpen(true)}
        afterHide={() => setIsOpen(false)}
      >
        { children }
      </ReactTooltip>
    </div>
  )
}


export default Avatar

