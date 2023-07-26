import { Navbar } from '../components/navbar';
import '../styles/global.css'
import 'tailwindcss/tailwind.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
    
  );
}
