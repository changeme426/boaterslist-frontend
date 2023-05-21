import * as opensearch from 'web-app/lib/opensearch'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import hasRole from 'common/utils/hasRole'

const c = opensearch.newClient()

export default withApiAuthRequired(async function shows(req, res) {
  const session = await getSession(req, res)
  const isAdmin = hasRole(session?.user, 'admin')
  if (!isAdmin) {
    // not authorized
    res.status(403).json({})
    return
  }
  // get claims
  let r = await opensearch.search(c, {
    index: 'locations', body: {
      'size': 50,
      "query": {
        "constant_score": {
          "filter": {
            "bool": {
              "must": [
                { "exists": { "field": "claimedBy2" } },
                { "term": { "claimVerified2": "false" } }
              ]
            }
          }
        }
      }
    }
  })
  const hits = r.body?.hits?.hits
  if (!hits) {
    res.status(404).json({})
    return
  }
  r = hits.map((v: any) => {
    const rv = v._source
    rv.locationId = v._id
    return rv
  })
  console.log("CLAIMS", r)
  res.status(200).json(r)
})
