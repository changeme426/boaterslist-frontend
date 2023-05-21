import * as opensearch from 'web-app/lib/opensearch'
import type { NextApiRequest, NextApiResponse } from 'next'

const c = opensearch.newClient()

export default async function search(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query['id'])
  if (!id) {
    res.status(404).json({})
    return
  }

  let query
  query = {
    'match': {
      '_id': id,
    },
  }

  const r = await opensearch.search(c, {
    index: 'locations', body: {
      'size': 1,
      'query': query,
    }
  })

  console.log("LOCATION", r.body?.hits?.hits)
  const loc = r.body?.hits?.hits[0]?._source
  if (!loc) {
    res.status(404).json({})
    return
  }
  // TODO refactor - set locationId for backward compatibility
  loc.locationId = r.body.hits.hits[0]._id
  res.status(200).json(loc)
}
