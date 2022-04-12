import { setPreviewData, redirectToPreviewURL } from '@prismicio/next'
import { createClient, linkResolver } from '../../services/prismic';


export default async (req, res) => {
  const client = createClient({ req })
   setPreviewData({ req, res })
    // console.log(res)
  await redirectToPreviewURL({ req, res, client, linkResolver })
}
