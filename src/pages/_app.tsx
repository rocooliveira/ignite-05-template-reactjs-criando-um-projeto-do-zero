import { AppProps } from 'next/app';
import NextNprogress from 'nextjs-progressbar';
// import { PrismicProvider } from '@prismicio/react';
// import { PrismicPreview } from '@prismicio/next';
// import { linkResolver, repositoryName } from '../services/prismic';

import Header from '../components/Header';
import '../styles/globals.scss';
import Link from 'next/link';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return(
    <>
      <NextNprogress
        color="#FF57B2"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
      />
        {/* <PrismicProvider

        > */}

          {/* <PrismicPreview repositoryName={repositoryName}> */}
            <Header/>
            <Component {...pageProps} />
          {/* </PrismicPreview> */}
        {/* </PrismicProvider> */}
    </>
  );
}

export default MyApp;
