import '../styles/globals.css'
import 'material-icons/iconfont/material-icons.css'

function MyApp({ Component, pageProps }) { 
  return (
    <>
      <Component {...pageProps} />
      <div id='modal-root'></div>
    </>
  )
}

export default MyApp
