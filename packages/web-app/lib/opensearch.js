import * as opensearch from '@opensearch-project/opensearch'
import { Sha256 } from '@aws-crypto/sha256-browser'
import { SignatureV4 } from '@aws-sdk/signature-v4'
import { HttpRequest } from '@aws-sdk/protocol-http'
import { NodeHttpHandler } from '@aws-sdk/node-http-handler'
const https = require('https')

export function newClient() {
  const isLocal = process.env.SEARCH_HOST.startsWith('localhost')
  return {
    isLocal: isLocal,
    domain: process.env.SEARCH_HOST,
    region: process.env.BL_AWS_REGION,
    credProvider: credProviderFromParams(process.env.BL_AWS_ACCESS_KEY_ID, process.env.BL_AWS_SECRET_ACCESS_KEY),
    // TODO remove client or fix to work with AWS
    client: isLocal ? new opensearch.Client({
      node: 'https://admin:admin@localhost:9200',
      ssl: {
        rejectUnauthorized: false,
      }
    }) : null,
  }
}

function credProviderFromParams(accessKeyId, secretAccessKey) {
  return function () {
    if (accessKeyId && secretAccessKey) {
      return Promise.resolve({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      });
    }
    return Promise.reject(new CredentialsProviderError("Credential params not provided."));
  };
}

export async function search(c, document) {
  if (document.sql) {
    let doc = { query: document.sql }
    if (document.fetch_size) {
      doc = {
        ...doc,
        fetch_size: document.fetch_size
      }
    }
    if (c.isLocal) {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      })
      const options = {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from("admin:admin", "utf-8").toString("base64")}`,
        },
        agent: httpsAgent,
      }
      const r = await fetch(`https://${c.domain}/_plugins/_sql`, options)
      const data = await r.json()
      return { body: data }
    }
    return await doRequest(c, "POST", "_plugins", "_sql", doc)
  }
  if (document.cursor){
    let doc = { cursor: document.cursor }
    if (c.isLocal) {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      })
      const options = {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from("admin:admin", "utf-8").toString("base64")}`,
        },
        agent: httpsAgent,
      }
      const r = await fetch(`https://${c.domain}/_plugins/_sql`, options)
      const data = await r.json()
      return { body: data }
    }
    return await doRequest(c, "POST", "_plugins", "_sql", doc)
  }
  if (c.isLocal) {
    return await c.client.search(document)
  }
  return await doRequest(c, "POST", document.index, "_search", document.body)
}

export async function userAction(c, body) {
  if (c.isLocal) {
    const document = {
      index: 'useraction',
      body: body,
    }
    c.client.index(document)
    return
  }
  doRequest(c, "POST", "useraction", `_doc`, body)
}

export async function newLocation(c, body) {
  if (c.isLocal) {
    const document = {
      index: 'locations',
      body: body,
      refresh: true
    }
    return await c.client.index(document)
  }
  return await doRequest(c, "POST", "locations", `_doc`, body)
}

export async function getLocation(c, id) {
  return await search(c, {
    index: 'locations', body: {
      'size': 1,
      'query': {
        'match': {
          '_id': id,
        },
      },
    }
  })
}

export async function getClaim(c, locId) {
  return await search(c, {
    index: 'locations', body: {
      'size': 1,
      'query': {
        'match': {
          'claimedFromId2': locId,
        },
      },
    }
  })
}

export async function deleteLocation(c, id) {
  if (c.isLocal) {
    return await c.client.delete({ index: 'locations', id: id })
  }
  return await doRequest(c, "DELETE", "locations", `_doc/${id}`)
}

export async function updateLocation(c, body) {
  const document = {
    id: body.locationId,
    index: 'locations',
    body: body,
    refresh: true
  }
  if (c.isLocal) {
    return await c.client.index(document)
  }
  return await doRequest(c, "PUT", "locations", `_doc/${document.id}`, body)
}

export async function deleteIndex(c, index) {
  return await doRequest(c, "DELETE", index)
}

export async function putMappings(c, index, mappings) {
  return await doRequest(c, "PUT", index, null, mappings)
}

// TODO switch opensearch client someday when it works with AWS Opensearch
async function doRequest(c, method, index, path, document) {
  var request = new HttpRequest({
    headers: {
      'host': c.domain,
    },
    hostname: c.domain,
    method: method,
    path: '/' + index + (path ? `/${path}` : ""),
  })
  if (method != "DELETE") {
    request.headers['Content-Type'] = 'application/json'
  }
  if (document) {
    request.body = JSON.stringify(document)
  }

  // Sign the request
  var signer = new SignatureV4({
    credentials: c.credProvider,
    region: c.region,
    service: 'es',
    sha256: Sha256
  })
  var signedRequest = await signer.sign(request)

  // Send the request
  var client = new NodeHttpHandler()
  var { response } = await client.handle(signedRequest)
  // TODO optimize to use [] buffer
  var responseBody = ''
  return new Promise((resolve, reject) => {
    response.body.on('data', (chunk) => {
      responseBody += chunk;
    })
    response.body.on('end', () => {
      resolve({ body: JSON.parse(responseBody) })
    })
  }).catch((error) => {
    console.log('Error: ' + error)
    reject(error)
  })
}
