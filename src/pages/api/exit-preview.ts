export default async(_, res) => {

  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData()

  // Redirect the user back to the index page.
  res.writeHead(307, { Location: '/' })
  res.end()
}
// import { exitPreview } from '@prismicio/next'


// export default async (req, res) => {
//   await exitPreview({ res, req });

//   res.writeHead(307, { Location: '/' })
//   // res.end()
// }
