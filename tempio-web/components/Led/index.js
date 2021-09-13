import classNames from 'classnames'

import styles from 'styles/Led.module.css'

function Led ({ className = '', status = 0 }) {
  const style = classNames(
    styles['led'], {
      [styles['led--on']]: status,
      [styles['led--off']]: !status,
    },
    className
  )

  return (
    <span className={style}></span>
  )
}

export default Led