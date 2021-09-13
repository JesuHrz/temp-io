import classNames from 'classnames'
import styles from 'styles/Form.module.css'

function FieldGroup (props) {
  const { className, onChange, label, name, type = 'text', value, ...rest } = props
  return (
    <div className={classNames(styles['form__group'], className)}>
      <label className={styles['form__label']} htmlFor={name}>{label}</label>
      <input
        className={styles['form__input']}
        id={name}
        name={name}
        type={type}
        onChange={onChange}
        defaultValue={value}
        {...rest}
      />
    </div>
  )
}

export default FieldGroup
