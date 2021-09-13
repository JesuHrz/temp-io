import RowActions from 'components/Table/RowActions'
import styles from 'styles/Table.module.css'

function Table ({ headings = [], data = [] }) {
  return (
    <table className={styles['table']}>
      <thead>
        <tr>
          { headings.map((heading, i) => <th key={i}>{heading}</th>) }
        </tr>
      </thead>
      <tbody>
        {
          data.map((item, i) => {
            const items = Object.values(item).map((value, i) => {
              return <td key={i}>{value}</td>
            })

            return <tr key={i}>{items}</tr>
          })
        }
      </tbody>
    </table>
  )
}

export {
  Table as default,
  RowActions
}
