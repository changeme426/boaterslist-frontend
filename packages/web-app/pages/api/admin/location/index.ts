import * as opensearch from 'web-app/lib/opensearch'
import { Client } from '@opensearch-project/opensearch'
import type { NextApiRequest, NextApiResponse } from 'next'
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
  if (req.method != 'POST') {
    res.status(404)
    return
  }
  console.log("POST request", req.body)
  const r = await opensearch.newLocation(c, req.body)
  console.log("POST response", r)
  if (!r.body || r.body.error) {
    console.log("NEW LOCATION ERROR", r.body?.error)
    res.status(500).json({})
    return
  }
  res.status(200).json({id:r.body._id})
  return
})
