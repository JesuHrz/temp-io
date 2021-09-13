import Image from 'next/image'
import styles from 'styles/SignInLayout.module.css'

export default function SignInLayout ({ children, imageSrc, imageAlt }) {
  return (
    <main className={styles['signin-layout']}>
      <div className={styles['signin-layout__container']}>
        <div className={styles['signin-layout__content']}>
          {children}
        </div>
        <div className={styles['signin-layout__poster']}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            layout='fill'
            className={styles['signin-layout__poster']}
          />
        </div>
      </div>
    </main>
  )
}
