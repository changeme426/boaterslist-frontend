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
  const id = String(req.query['id'])
  if (!id) {
    res.status(404).json({})
    return
  }
  let r = await opensearch.getLocation(c, id)
  const loc = r.body?.hits?.hits[0]?._source
  if (!loc || loc.active || !loc.claimedBy2) {
    // not a claim
    res.status(404).json({})
    return
  }

  // reject claim - delete the claim
  r = await opensearch.deleteLocation(c, id)
  console.log("REJECT", r)
  res.status(200).json({})
  return
})
