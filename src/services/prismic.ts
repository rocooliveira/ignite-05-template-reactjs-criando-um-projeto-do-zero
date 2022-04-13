/*
-----------------------------------------------------------------------------------------
ALTERADO PARA VERSAO ANTIGA DO PRISMIC PARA PASSAR NO TESTE DA ROCKETSEAT QUE NAO USA
A VERSAO ATUALIZADA. VERSAO ATUALIZADA USADA NA BRANCH DE DEV NO EXERCICIO COMPLEMENTAR
-----------------------------------------------------------------------------------------

import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';

export const endpoint = process.env.PRISMIC_API_ENDPOINT;//'https://blogrocotest2.prismic.io/api/v2';

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
*/
import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';

export function getPrismicClient(req?: unknown): DefaultClient {
  const prismic = Prismic.client(process.env.PRISMIC_API_ENDPOINT, {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return prismic;
}
