import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import * as opensearch from 'web-app/lib/opensearch'

const c = opensearch.newClient()

export default withApiAuthRequired(async function api(req, res) {
  if (req.method != "POST") {
    res.status(400).json({})
    return
  }
  const session = await getSession(req, res)
  if (!session || !session?.user?.email) {
    res.status(403).json({})
    return
  }

  let r = await opensearch.search(c, {
    sql: "select count(*) from locations where claimedBy2='" + session?.user?.email +
      "' and claimVerified2=false and active=false",
  })
  console.log("EXISTING CLAIMS", JSON.stringify(r))
  if (r.body.datarows[0][0] > 0) {
    res.status(400).json({ error: 'Only one open claim request is allowed' })
    return
  }

  const b = req.body
  if (!b.address1 || !b.coordinate || !b.locationName || !b.description) {
    res.status(400).json({ error: 'Mandatory fields not set' })
    return
  }

  // create new location claim
  const loc = {} as any
  loc.address1 = b.address1
  loc.address2 = b.address2
  loc.bestFormOfCommunication = b.bestFormOfCommunication
  loc.boatSize = b.boatSize
  loc.categories = b.categories
  loc.city = b.city
  loc.contactEmail = b.contactEmail
  loc.contactPerson = b.contactPerson
  loc.contactPhone = b.contactPhone
  loc.coordinate = b.coordinate
  loc.country = b.country
  loc.ctaJSON = b.ctaJSON
  loc.description = b.description
  loc.electricShorePower = b.electricShorePower
  loc.fuel = b.fuel
  loc.isPrivate = b.isPrivate
  loc.listed = b.listed
  loc.locationName = b.locationName
  loc.membershipNeeded = b.membershipNeeded
  loc.operatingDaysHoursJSON = b.operatingDaysHoursJSON
  loc.peopleServiceMaxCount = b.peopleServiceMaxCount
  loc.phoneNumber = b.phoneNumber
  loc.priceRangeHigh = b.priceRangeHigh
  loc.priceRangeLow = b.priceRangeLow
  loc.priceRangeString = b.priceRangeString
  loc.privacyMembershipString = b.privacyMembershipString
  loc.slips = b.slips
  loc.sponsoredBy = b.sponsoredBy
  loc.state = b.state
  loc.subCategories = b.subCategories
  loc.website = b.website
  loc.zipCode = b.zipCode

  loc.active = false
  loc.claimedBy2 = session?.user.email
  loc.claimedOn2 = new Date().toISOString()
  loc.claimVerified2 = false
  loc.createdByEmail = session?.user.email
  loc.dateCreated = new Date().toISOString()
  loc.interestedIn2 = b.interestedIn2
  loc.howYouHearAboutUs2 = b.howYouHearAboutUs2

  console.log("NEW BUSINESS CLAIM REQUEST", loc)
  r = await opensearch.newLocation(c, loc)
  console.log("NEW BUSINESS CLAIM OPENSEARCH RESPONSE", r)
  loc.locationId = r.body._id
  loc.id = loc.locationId
  res.status(200).json(loc)
})
