import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
// import sm from './sm.json'

export const endpoint = process.env.PRISMIC_API_ENDPOINT;//'https://blogrocotest2.prismic.io/api/v2';

// export const repositoryName = prismic.getRepositoryName(endpoint)


// Update the Link Resolver to match your project's route structure
export function linkResolver(doc: any = {}) {
  if (doc.type === 'post') {
    return `/post/${doc.uid}`;
  }
  return '/';
}

// This factory function allows smooth preview setup
export function getPrismicClient(config: any = {}) {
  const client = prismic.createClient(endpoint, {
    ...config,
  })

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  })

  return client;
}
