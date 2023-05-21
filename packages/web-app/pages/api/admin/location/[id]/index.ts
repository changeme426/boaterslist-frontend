import * as opensearch from 'web-app/lib/opensearch'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import hasRole from 'common/utils/hasRole'

const c = opensearch.newClient()

export default withApiAuthRequired(async function api(req, res) {
  const session = await getSession(req, res)
  const isAdmin = hasRole(session?.user, 'admin')
  if (!isAdmin) {
    // not authorized
    res.status(403).json(null)
    return
  }
  const id = String(req.query['id'])
  if (!id) {
    res.status(404).json(null)
    return
  }
  if (req.method == 'PUT') {
    req.body.locationId = id
    console.log("PUT request", req.body)
    let r = await opensearch.updateLocation(c, req.body)
    console.log("PUT response", r)
    res.status(200).json({})
    return
  }

  let query
  query = {
    'match': {
      'locationId': {
        'query': id,
      },
    },
  }

  const r = await opensearch.search(c, {
    index: 'locations', body: {
      'size': 1,
      'query': query,
    }
  })

  const loc = r.body?.hits?.hits[0]?._source
  if (!loc) {
    res.status(404)
    return
  }
  res.status(200).json(loc)
})
