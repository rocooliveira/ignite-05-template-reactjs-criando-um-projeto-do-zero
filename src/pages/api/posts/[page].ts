import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismicClient } from '../../../services/prismic';


export default async (request: NextApiRequest, response: NextApiResponse) => {
  const prismic = getPrismicClient(request);

  const posts = await prismic.query('',{
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    page: request.query.page,
    pageSize: 1,
  });

  return response.json(posts)
}
