import * as opensearch from 'web-app/lib/opensearch'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRawCategories } from 'common/global/categories';
import lunr from 'lunr'

interface Item {
  id: string
  leftIcon?: string
  title: string
  detail?: string
  rightIcon?: string
}

interface Group {
  id: string
  title?: string
  data: Array<Item>
}

const c = opensearch.newClient()

export default async function suggest(req: NextApiRequest, res: NextApiResponse) {
  const maxResults = 12
  var q = String(req.query['q'])
  const lat = req.query['lat']
  const lon = req.query['lon']

  // default pin to San Antonio
  const pin = (lat && lon) ? [Number(lon), Number(lat)] : [-98.491142, 29.424349]

  let suggestedRaw = queryCategories(q, 5)

  // do search
  let query
  if (q) {
    if (typeof q == "string" && q.length > 2 && q.endsWith('s')) {
      q = q.substring(0, q.length - 1)
    }
    query = {
      'bool': {
        'must_not': [{ term: { active: false } }],
        'must': [
          {
            'match_phrase_prefix': {
              'locationName': {
                'query': q,
              },
            },
          },
        ],
      },
    }
  } else {
    query = {
      'bool': {
        'must': [{ 'term': { 'active': 'true' }, }],
      },
    }
  }

  const nearbyRaw = await opensearch.search(c, {
    index: 'locations', body: {
      'size': 3,
      'query': query,
      'sort': [
        {
          "premiere": {
            "order": "asc"
          }
        },
        {
          '_geo_distance': {
            'coordinate': pin,
            'order': 'asc',
            'unit': 'km',
          },
        },
      ],
    }
  })

  // build result
  const r = Array<Group>()

  // nearby
  const nearby = nearbyRaw.body.hits.hits.map(function (item: any) {
    let s = item._source
    return {
      id: item._id,
      leftIcon: 'ship',
      title: s.locationName?.trim(),
      detail: s.address1?.trim() + ', ' + s.state?.trim(),
      rightIcon: s.premiere ? 'premiere' : s.verified ? 'verified' : '',
    }
  })
  if (nearby.length > 0) {
    r.unshift({ id: 'nearby', title: 'Nearby', data: nearby })
  }

  // suggested
  const suggested = Array<Item>()
  if (nearby.length + suggestedRaw.length < maxResults) {
    // get more suggested items
    suggestedRaw = queryCategories(q, maxResults - nearby.length)
  }
  for (let i = 0; i < suggestedRaw.length; i++) {
    const item = suggestedRaw[i]
    if (item.subCategoryId) {
      suggested.push({ id: 's-' + item.categoryId + '-' + item.subCategoryId, leftIcon: 'search', title: String(item.subCategoryName) })
    } else {
      suggested.push({ id: 's-' + item.categoryId, leftIcon: 'search', title: String(item.categoryName) })
    }
  }
  if (suggested.length > 0) {
    r.push({ id: 'suggested', title: 'Suggested', data: suggested })
  }

  // TODO recent
  const recent = Array<Item>()
  if (r.length < maxResults) {
    // TODO get more recent items
  }
  if (recent.length > 0) {
    r.push({ id: 'recent', title: 'Recent', data: recent })
  }

  res.status(200).json(r)
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
