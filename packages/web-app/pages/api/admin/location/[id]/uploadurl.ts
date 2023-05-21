import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { S3Client } from '@aws-sdk/client-s3'
import hasRole from 'common/utils/hasRole'
import { IncomingForm, Part } from 'formidable'
import * as fs from 'fs';
import { PassThrough } from 'stream';

export default withApiAuthRequired(async function api(req, res) {
  const session = await getSession(req, res)
  const isAdmin = hasRole(session?.user, 'admin')
  if (!isAdmin) {
    // not authorized
    res.status(403).json(null)
    return
  }
  const id = String(req.query['id'])
  const file = req.query.file
  if (req.method != 'GET' || !id || !file) {
    res.status(400)
    return
  }

  const s3Client = new S3Client({
    region: process.env.BL_AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.BL_AWS_S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.BL_AWS_S3_SECRET_ACCESS_KEY ?? '',
    },
  })
  const conditions = [
    { acl: 'public-read' },
    { bucket: process.env.BL_AWS_S3_IMAGE_BUCKET },
    ['starts-with', '$key', `loc-${id}-`],
    ['content-length-range', 1, 2000000],
  ]
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: process.env.BL_AWS_S3_IMAGE_BUCKET as string,
    Key: file as string,
    Conditions: conditions as any,
    Fields: { acl: 'public-read' },
    Expires: 600,
  })
  res.status(200).json({ url: url, fields: fields })
})

export const config = {
  api: {
    bodyParser: false,
  },
}
