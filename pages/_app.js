import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from 'react-toastify'

function MyApp({ Component, pageProps }) {
  return (
  <>
    <ToastContainer/>
    <Component {...pageProps} />
  </>  
  )
}

export default MyApp
