import "@/styles/globals.css";
import {SessionProvider} from "next-auth/react";
import { MoralisProvider } from 'react-moralis'
export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
          <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
          </SessionProvider>
    </MoralisProvider>
  )

  // return <Component {...pageProps} />;
}
