import { useRef } from 'react'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'
import styles from 'styles/Table.module.css'

function RowActions ({ id, onEdit, onDelete }) {
  const tooltipRef = useRef(null)

  return (
    <div className={styles['table__tooltip-container']}>
      <a
        className={styles['table__tooltip-button']}
        data-tip
        data-for={`action-buttons-${id}`}
        data-event='click'
      >
        <span className='material-icons-outlined'>more_horiz</span>
      </a>
      <ReactTooltip
        ref={tooltipRef}
        id={`action-buttons-${id}`}
        place='bottom'
        type='dark'
        effect='solid'
        globalEventOff='click'
        offset={{'top': 6, 'left': 0}}
        className={classNames(styles['table__tooltip'], styles['place-bottom'])}
      >
        <a id={id} onClick={() => { onEdit(id) }}>Editar</a>
        <a onClick={() => { onDelete(id) }}>Eliminar</a>
      </ReactTooltip>
    </div>
  )
}

export default RowActions