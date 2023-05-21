import * as geodist from 'web-app/lib/geodist'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@auth0/nextjs-auth0'
import { getRawCategories } from 'common/global/categories';
import lunr from 'lunr'
import * as opensearch from 'web-app/lib/opensearch'

interface Item {
  id: string
  leftIcon?: string
  title: string
  detail?: string
  rightIcon?: string
}

interface Group {
  id: string
  offset: number
  total: number
  title?: string
  data: Array<Item>
}

const c = opensearch.newClient()

//export default withApiAuthRequired(async function api(req, res) {

export default async function suggest(req: NextApiRequest, res: NextApiResponse) {
  const sessionPromise = getSession(req, res)
  const cat = req.query['c']
  const subcat = req.query['sc']
  const lat = req.query['lat']
  const lon = req.query['lon']
  const ulat = req.query['ulat']
  const ulon = req.query['ulon']
  const inactive = req.query['inactive']
  let q = typeof req.query['q'] == "string" ? (req.query['q'] as string).trim() : ""
  const wide = (req.query['$wide'] == '1' || q) ? true : false
  const showInactive = (inactive && inactive === '1') ? true : false
  const skip = typeof req.query['$skip'] == 'string' ? parseInt(req.query['$skip']) : 0
  let top = typeof req.query['$top'] == 'string' ? parseInt(req.query['$top']) : 50
  if (top > 50) {
    top = 50
  }
  // default pin to San Antonio
  const pin = (lat && lon) ? [Number(lon), Number(lat)] : [-98.491142, 29.424349]
  console.log("PIN", pin)
  let includePremiere = (skip > 0) ? false : true

  let query
  const bb = geodist.boundingBox(pin, 200)
  const bbFilter = {
    "geo_bounding_box": {
      "coordinate": {
        "top_left": {
          "lon": bb[0],
          "lat": bb[3],
        },
        "bottom_right": {
          "lon": bb[2],
          "lat": bb[1]
        }
      }
    }
  }

  const filter = []
  const mustNot = []
  let categories: number[] = []
  let subCategories: number[] = []

  // add query category/subCategory
  if (typeof cat === 'string') {
    categories.push(parseInt(String(cat)))
    filter.push({ term: { categories: categories[0] } })
  } else if (typeof subcat === 'string') {
    subCategories.push(parseInt(String(subcat)))
    filter.push({ term: { subCategories: subCategories[0] } })
  }

  //do not show inactive if there is no flag true
  if (!showInactive) {
    mustNot.push({ term: { active: false } });
  }

  // match categories/subCategories from q param - one word only
  if (q && q.indexOf(" ") == -1) {
    let cats = queryCategories(q, 3)
    cats.forEach(sr => {
      if (sr.subCategoryId) {
        const sc = parseInt(sr.subCategoryId)
        subCategories.push(sc)
      } else {
        const c = parseInt(sr.categoryId)
        categories.push(c)
      }
    })
    console.log("CATEGORIES", cats, categories, subCategories)
  }

  var should: any[] = []
  subCategories.forEach(sc => {
    should.push({ 'match': { 'subCategories': sc } })
  })
  categories.forEach(c => {
    should.push({ 'match': { 'categories': c } })
  })

  const qFilter = [...filter]
  if (!wide) {
    qFilter.push(bbFilter as any)
  }
  if (q == "Claimed Businesses") {
    const session = await sessionPromise
    query = {
      'bool': {
        'must_not': mustNot,
        'must': [{ term: { claimedBy2: session?.user?.email } }],
      }
    }
  } else if (q) {
    if (typeof q == "string" && q.length > 2 && q.endsWith('s')) {
      q = q.substring(0, q.length - 1)
    }
    should.push({ 'match_phrase_prefix': { 'locationName': q } })
    query = {
      'bool': {
        'must_not': mustNot,
        'should': should,
        'filter': qFilter,
      }
    } as any
  } else {
    query = {
      'bool': {
        'must_not': mustNot,
        'should': should,
        'filter': qFilter,
      }
    } as any
  }

  // TODO console.log("QUERY", JSON.stringify(query), pin)
  const searchQ = {
    index: 'locations', body: {
      'from': skip,
      'size': top,
      'query': query,
      'sort': [
        {
          '_geo_distance': {
            'coordinate': pin,
            'order': 'asc',
            'unit': 'mi',       // TODO make query param
          },
        },
      ],
    }
  }

  let searchPQ
  if (includePremiere) {
    should = []
    subCategories.forEach(sc => {
      should.push({ 'match': { 'promotedSubCategories': sc } })
    })
    categories.forEach(c => {
      should.push({ 'match': { 'categories': c } })
    })
    const premiereQuery = {
      "bool": {
        'must_not': mustNot,
        "must": [{ "term": { "premiere": true } }, { "bool": { "should": should } }],
        "filter": [...filter, bbFilter],
      }
    } as any


    searchPQ = {
      index: 'locations', body: {
        'size': 15,
        'query': premiereQuery,
        'sort': [
          {
            '_geo_distance': {
              'coordinate': pin,
              'order': 'asc',
              'unit': 'mi',       // TODO make query param
            },
          },
        ],
      }
    }
    console.log("SEARCHPQ", JSON.stringify(searchPQ))
  }

  let nearbyRaw
  let premiere
  console.log("SEARCHQ", JSON.stringify(searchQ))
  if (includePremiere) {
    [nearbyRaw, premiere] = await Promise.all([opensearch.search(c, searchQ), opensearch.search(c, searchPQ)])
  } else {
    nearbyRaw = await opensearch.search(c, searchQ)
    premiere = []
  }
  if (!nearbyRaw.body || nearbyRaw.body.error) {
    console.log("SEARCH ERROR", nearbyRaw.body?.error)
    console.log("SEARCH SHARD ERROR", nearbyRaw.body?.error?.failed_shards)
    res.status(500).json([])
    return
  }
  let premiereItems = []
  if (includePremiere) {
    if (!premiere.body || premiere.body.error) {
      console.log("PREMIERE SEARCH ERROR", premiere.body?.error)
      console.log("PREMIERE SEARCH SHARD ERROR", premiere.body?.error?.failed_shards)
      res.status(500).json([])
      return
    }
    premiereItems = premiere.body.hits.hits
  }

  // log user action
  const session = await sessionPromise
  const ucoord = (ulon && ulat) ? [Number(ulon), Number(ulat)] : null
  const action = {
    timestamp: Date.now(),
    user: {
      coordinate: ucoord,
      name: session?.user?.name,
      email: session?.user?.email,
      email_verified: session?.user?.email_verified,
      sub: session?.user?.sub,
    },
    action: "search",
    search: {
      q,
      coordinate: pin,
      categories,
      subCategories,
      skip,
      top,
      wide,
      results: {
        count: nearbyRaw.body.hits.hits.length,
        promoted: premiereItems.length,
        total: nearbyRaw.body.hits.total.value
      }
    }
  }
  console.log("ACTION", JSON.stringify(action))
  await opensearch.userAction(c, action)

  // build result
  const nearby = Array<any>()
  const premiereIds = {} as any
  for (let i = 0; i < premiereItems.length; i++) {
    const item = premiereItems[i]
    const s = item._source
    if (s.coordinate) {
      premiereIds[item._id] = true
      nearby.push(makeItem(item, pin))
    }
  }

  // nearby
  for (let i = 0; i < nearbyRaw.body.hits.hits.length; i++) {
    const item = nearbyRaw.body.hits.hits[i]
    if (!premiereIds[item._id]) {
      // add non boosted items
      nearby.push(makeItem(item, pin))
    }
  }
  const r = Array<Group>()
  let grp
  if (nearby.length > 0) {
    grp = { id: 'results', title: 'Search Results', data: nearby, offset: skip } as Group
    const t = nearbyRaw.body.hits.total.value
    if (t < 10000) {
      grp.total = t
    }
    r.unshift(grp)
  }
  // TODO remove console.log("SEARCH RESULT", JSON.stringify(r))
  res.status(200).json(r)
}

function makeItem(item: any, pin: any): any {
  let s = item._source
  // TODO add unit param
  if (s.coordinate) {
    s.dist = geodist.distance(pin[1], pin[0], s.coordinate.lat, s.coordinate.lon, 'M')
  }
  return {
    id: item._id,
    source: s,
  }
}

export interface Category {
  categoryId: string
  categoryNumber?: string
  categoryName?: string
  subCategoryId?: string
  subCategoryNumber?: string
  subCategoryName?: string
  subCategories?: Category[]
  active?: string
}

const categories: Array<Category> = getRawCategories()

var catidx = lunr(function () {
  this.field('name')
  for (let i = 0; i < categories.length; i++) {
    let item = categories[i]
    if (item.subCategoryName) {
      this.add({ id: i, name: item.subCategoryName })
    } else {
      this.add({ id: i, name: item.categoryName })
    }
  }
})

function queryCategories(q: string, size: number) {
  const r = catidx.search(q)
  let rr = []
  for (let i = 0; i < Math.min(r.length, size); i++) {
    rr.push(categories[parseInt(r[i].ref)])
  }
  return rr
}
