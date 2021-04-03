import { Provider } from '../context/Context';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
  <Provider>
    <Component {...pageProps} />
  </Provider>
  )
}

export default MyApp
