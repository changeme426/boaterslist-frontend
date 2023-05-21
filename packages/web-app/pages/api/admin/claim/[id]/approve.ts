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
  console.log("APPROVE", id)
  let r = await opensearch.getLocation(c, id)
  const loc = r.body?.hits?.hits[0]?._source
  if (!loc) {
    res.status(404).json({})
    return
  }
  // approve claim - update from claim location and delete claim
  if (loc.claimedFromId2) {
    loc.locationId = loc.claimedFromId2
  } else {
    loc.locationId = id
    loc.dateCreated = new Date().toISOString()
  }
  loc.claimVerified2 = true
  loc.claimedFromId2 = null
  loc.active = true
  console.log("APPROVE", loc)
  r = await opensearch.updateLocation(c, loc)
  console.log("APPROVE OPENSEARCH RESPONSE", r)
  if (loc.locationId != id) {
    // claim existing location - remove claim
    r = await opensearch.deleteLocation(c, id)
    console.log("APPROVE OPENSEARCH DELETE RESPONSE", r)
  }
  res.status(200).json({})
  return
})
