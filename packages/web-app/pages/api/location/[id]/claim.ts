import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import * as opensearch from 'web-app/lib/opensearch'
import hasRole from 'common/utils/hasRole'

const c = opensearch.newClient()

export default withApiAuthRequired(async function api(req, res) {
  const session = await getSession(req, res)
  const id = String(req.query['id'])
  if (!id || !session?.user?.email) {
    res.status(404).json(null)
    return
  }

  if (req.method != "GET" && req.method != "POST" && req.method != "PUT") {
    res.status(400).json(null)
    return
  }

  console.log("METHOD", req.method)
  if (req.method == "GET") {
    // get claim for this location
    console.log("GET CLAIM for location", id)
    let r = await opensearch.getClaim(c, id)
    const loc = r.body?.hits?.hits[0]?._source
    if (loc && loc.claimedFromId2 && loc.claimedBy2 == session?.user?.email) {
      // return claim so we can edit
      res.status(200).json(loc)
    } else {
      // not found
      res.status(404).json(null)
    }
    return
  }

  // fetch location
  let r = await opensearch.getLocation(c, id)
  console.log("LOCATION", r.body?.hits?.hits)
  const loc = r.body?.hits?.hits[0]?._source
  if (!loc) {
    res.status(404).json(null)
    return
  }
  if (req.method == "PUT") {
    // update claim
    console.log("UPDATE CLAIM request", req.body)
    // check if allowed
    const isAdmin = hasRole(session?.user, 'admin')
    if (!isAdmin) {
      if (loc.active || loc.claimedBy2 != session.user.email || loc.claimVerified2 ||
        (!(loc.claimedBy2 == session.user.email))) {
        console.log("CLAIM UPDATE NOT ALLOWED")
        res.status(403).json({})
        return
      }
    }
    // update claim
    const b = req.body
    const newLoc = { ...loc }
    newLoc.locationId = id
    newLoc.address1 = b.address1
    newLoc.address2 = b.address2
    newLoc.bestFormOfCommunication = b.bestFormOfCommunication
    newLoc.boatSize = b.boatSize
    newLoc.categories = b.categories
    newLoc.city = b.city
    newLoc.contactEmail = b.contactEmail
    newLoc.contactPerson = b.contactPerson
    newLoc.contactPhone = b.contactPhone
    newLoc.coordinate = b.coordinate
    newLoc.country = b.country
    newLoc.ctaJSON = b.ctaJSON
    newLoc.description = b.description
    newLoc.electricShorePower = b.electricShorePower
    newLoc.fuel = b.fuel
    newLoc.isPrivate = b.isPrivate
    newLoc.locationName = b.locationName
    newLoc.membershipNeeded = b.membershipNeeded
    newLoc.operatingDaysHoursJSON = b.operatingDaysHoursJSON
    newLoc.peopleServiceMaxCount = b.peopleServiceMaxCount
    newLoc.phoneNumber = b.phoneNumber
    newLoc.priceRangeHigh = b.priceRangeHigh
    newLoc.priceRangeLow = b.priceRangeLow
    newLoc.priceRangeString = b.priceRangeString
    newLoc.privacyMembershipString = b.privacyMembershipString
    newLoc.slips = b.slips
    newLoc.sponsoredBy = b.sponsoredBy
    newLoc.state = b.state
    newLoc.subCategories = b.subCategories
    newLoc.website = b.website
    newLoc.zipCode = b.zipCode
    newLoc.interestedIn2 = b.interestedIn2
    newLoc.howYouHearAboutUs2 = b.howYouHearAboutUs2
    console.log("UPDATE CLAIM REQUEST", newLoc)
    let r = await opensearch.updateLocation(c, newLoc)
    console.log("UPDATE CLAIM OPENSEARCH RESPONSE", r)
    res.status(200).json(null)
    return
  }

  // POST - new claim (new or get existing)
  if (!loc.active || loc.claimedFromId2 || (loc.claimedBy2 && !(loc.claimedBy2 == session.user.email))) {
    // can't create claim on a claim or inactive
    console.log("CLAIM NOT ALLOWED1", session.user.email, loc.claimedBy2)
    res.status(403).json({})
    return
  }

  // get existing claim if any
  r = await opensearch.getClaim(c, id)
  let claim = r.body?.hits?.hits[0]?._source
  if (claim) {
    if (claim.claimedBy2 == session.user.email) {
      // return existing claim
      res.status(200).json(claim)
    } else {
      // not our claim - error
      console.log("CLAIM NOT ALLOWED2")
      res.status(403).json(null)
    }
    return
  }

  // check for other open claims
  r = await opensearch.search(c, {
    sql: "select count(*) from locations where claimedBy2='" + session?.user?.email +
      "' and claimVerified2=false and active=false",
  })
  console.log("EXISTING CLAIMS", JSON.stringify(r))
  if (r.body.datarows[0][0] > 0) {
    res.status(400).json({ error: 'Only one open claim request is allowed' })
    return
  }

  // create claim
  const newLoc = { ...loc }
  newLoc.active = false
  newLoc.claimedBy2 = session.user.email
  newLoc.claimedFromId2 = id
  newLoc.claimedOn2 = new Date().toISOString()
  newLoc.claimVerified2 = false
  newLoc.locationId = null
  console.log("NEW CLAIM REQUEST", newLoc)
  r = await opensearch.newLocation(c, newLoc)
  console.log("NEW CLAIM OPENSEARCH RESPONSE", r)
  newLoc.locationId = r.body._id
  res.status(200).json(newLoc)
})
