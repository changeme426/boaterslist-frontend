#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import * as child_process from 'child_process'
import { CognitoStack } from '../lib/cognito-stack'
import { loadEnvConfig } from '@next/env'
import { OpensearchStack } from '../lib/opensearch-stack'
import { S3Stack } from '../lib/s3-stack'
import { IdentityProviderStack } from '../lib/identity-provider-stack'

// get current branch name
const branchBuf = child_process.execSync('git branch --show-current')
let branch = branchBuf.toString('utf8').trim()
if (branch == '') {
  throw new Error('Cannot determine git branch')
}

let stageName
let env
if (branch == "main") {
  // production
  stageName = "prod"
} else if (branch == "staging") {
  stageName = "staging"
} else {
  // development
  stageName = "dev"
}

// load environment variables from  .env.development/.env.development.local or .env.production/.env.production.local
loadEnvConfig(__dirname, stageName != "prod")

// AWS environments (simple one region for now)
interface Envs {
  [key: string]: Env
}
interface Env {
  awsEnv: cdk.Environment
  domainPrefix: string
  identityProvider: {
    audience: string
    domain: string
    secret: string
  },
  productionScale: boolean
}
const stagingAndProdIdentityProvider = {
  audience: "q65cLB3T46Or9sXKQPNuRlnI7xicAoL3",
  domain: "boaterslist.us.auth0.com",
  secret: process.env.BL_DASHBOARD_CLIENT_SECRET_AUTH0 as string,
}
const envs: Envs = {
  dev: {
    awsEnv: { account: '058556054004', region: 'us-east-1' },
    domainPrefix: 'boaterslist-dev',
    identityProvider: {
      audience: "m1Xn18fQzaS5JiS4cK0mb85FjLZOxpuu",
      domain: "boaterslist-development.us.auth0.com",
      secret: process.env.BL_DASHBOARD_CLIENT_SECRET_AUTH0 as string,
    },
    productionScale: false,
  },
  staging: {
    awsEnv: { account: '058556054004', region: 'us-west-1' },
    domainPrefix: 'boaterslist-staging',
    identityProvider: {
      audience: "q65cLB3T46Or9sXKQPNuRlnI7xicAoL3",
      domain: "boaterslist.us.auth0.com",
      secret: process.env.BL_STAGING_DASHBOARD_CLIENT_SECRET_AUTH0 as string,
    },
    productionScale: true,
  },
  prod: {
    awsEnv: { account: '849854957060', region: 'us-west-2' },
    domainPrefix: 'boaterslist-prod',
    identityProvider: {
      audience: "q65cLB3T46Or9sXKQPNuRlnI7xicAoL3",
      domain: "boaterslist.us.auth0.com",
      secret: process.env.BL_DASHBOARD_CLIENT_SECRET_AUTH0 as string,
    },
    productionScale: true,
  },
}

env = envs[stageName]
const app = new cdk.App()
const stage = new cdk.Stage(app, stageName, {
  env: env.awsEnv,
})
new IdentityProviderStack(stage, 'auth0provider', {
  audience: env.identityProvider.audience,
  domain: env.identityProvider.domain,
})

const s3 = new S3Stack(stage, 's3', {})
const cognitoStack = new CognitoStack(stage, 'cognito', {
  domain: env.domainPrefix,
  identityProviderClientId: env.identityProvider.audience,
  identityProviderDomain: env.identityProvider.domain,
  identityProviderClientSecret: env.identityProvider.secret
})
const osStack = new OpensearchStack(stage, 'opensearch', {
  cognitoStack: cognitoStack,
  domain: env.domainPrefix,
  productionScale: env.productionScale,
})
