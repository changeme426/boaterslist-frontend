import * as opensearch from 'web-app/lib/opensearch'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import hasRole from 'common/utils/hasRole'

interface Result {
  locations: number
  verifiedLocations: number
  locationsByEmail: any
}

const c = opensearch.newClient()

export default withApiAuthRequired(async function shows(req, res) {
  const session = await getSession(req, res)
  const isAdmin = hasRole(session?.user, 'admin')
  if (!isAdmin) {
    // not authorized
    res.status(403).json(null)
    return
  }
  let r = <Result>{}
  let qr = await opensearch.search(c, { sql: "select count(*) from locations" })
  if (!qr.body || !qr.body.datarows || qr.body.error) {
    console.log("SEARCH ERROR1", qr.body?.error)
    res.status(500).json([])
    return
  }
  r.locations = qr.body.datarows[0][0]

  qr = await opensearch.search(c, { sql: "select count(*) from locations where verified=true" })
  if (!qr.body || !qr.body.datarows || qr.body.error) {
    console.log("SEARCH ERROR2", qr.body?.error)
    res.status(500).json([])
    return
  }
  r.verifiedLocations = qr.body.datarows[0][0]

  qr = await opensearch.search(c, { sql: "select count(*), createdByEmail from locations group by createdByEmail order by createdByEmail" })
  if (!qr.body || !qr.body.datarows || qr.body.error) {
    console.log("SEARCH ERROR3", qr.body?.error)
    res.status(500).json([])
    return
  }
  let users: any
  users = {}
  for (let i = 0; i < qr.body.datarows.length; i++) {
    let email = String(qr.body.datarows[i][1])
    users[email] = { created: qr.body.datarows[i][0], verified: 0 }
  }

  qr = await opensearch.search(c, { sql: "select count(*), verifiedByEmail from locations group by verifiedByEmail order by verifiedByEmail" })
  if (!qr.body || !qr.body.datarows || qr.body.error) {
    console.log("SEARCH ERROR4", qr.body?.error)
    res.status(500).json([])
    return
  }
  for (let i = 0; i < qr.body.datarows.length; i++) {
    let email = String(qr.body.datarows[i][1])
    let v = users[email]
    if (!v) {
      v = { created: 0 }
      users[email] = v
    }
    v.verified = qr.body.datarows[i][0]
  }
  r.locationsByEmail = Object.keys(users).sort().map(k => {
    return {
      email: k, created: users[k].created, verified: users[k].verified
    }
  })

  res.status(200).json(r);
})
