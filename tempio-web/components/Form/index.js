import classNames from 'classnames'
import FieldGroup from 'components/Form/FieldGroup'
import styles from 'styles/Form.module.css'

function Form ({ className, title = '', onSubmit, children }) {
  return (
    <form
      className={classNames(styles['form'], className)}
      onSubmit={onSubmit}
    >
      {title && <h2 className={styles['form__title']}>{title}</h2>}
      { children }
    </form>
  )
}

function Submit ({ value = '', disabled = false, type = '' }) {
  return (
    <input
      disabled={disabled}
      className={classNames(styles['form__submit'], {
        [styles['form__submit--alert']]: type === 'alert'
      })}
      type='submit'
      value={value}
    />
  )
}

export {
  Form as default,
  FieldGroup,
  Submit
}
