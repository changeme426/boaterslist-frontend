import * as cdk from 'aws-cdk-lib'
import * as construct from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { CognitoStack } from './cognito-stack'
import { Bucket } from 'aws-cdk-lib/aws-s3'

interface OpensearchStackProps extends cdk.StackProps {
  cognitoStack: CognitoStack
  domain: string
  productionScale: boolean
}

export class OpensearchStack extends cdk.Stack {
  constructor(scope: construct.Construct, id: string, props: OpensearchStackProps) {
    super(scope, id, props)

    const snapshotRole = new iam.Role(this, "snapshotrole", {
      assumedBy: new iam.ServicePrincipal("es.amazonaws.com"),
    })

    const accessPolicies = [new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ArnPrincipal(props.cognitoStack.authRole.roleArn)],
      actions: ["es:ESHttp*"],
      resources: ['arn:aws:es:' + this.region + ':' + this.account + ':domain/' + props.domain + '/*'],
    }), new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ArnPrincipal(props.cognitoStack.authRole.roleArn)],
      actions: ["iam:PassRole"],
      resources: ['arn:aws:es:' + this.region + ':' + this.account + ':role/' + snapshotRole.roleName],
    })]
    const osrole = new iam.Role(this, 'esservicerole', {
      assumedBy: new iam.ServicePrincipal('es.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonOpenSearchServiceCognitoAccess')],
    })
    const capacity = props.productionScale ? {
      masterNodes: 3,
      masterNodeInstanceType: 'm3.medium.search',
      dataNodes: 2,
      dataNodeInstanceType: 'm3.medium.search',
      warmNodes: 0,
    } : {
      masterNodes: 2,
      masterNodeInstanceType: 't2.small.search',
      dataNodes: 1,
      dataNodeInstanceType: 't2.small.search',
      warmNodes: 0,
    }
    // TODO set availability zones?
    const osdomain = new opensearch.Domain(this, 'domain', {
      version: opensearch.EngineVersion.OPENSEARCH_1_1,
      domainName: props.domain,
      enableVersionUpgrade: true,
      capacity: capacity,
      ebs: {
        volumeSize: props.productionScale ? 10 : 10,
      },
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: props.productionScale ? true : false,
      },
      enforceHttps: true,
      accessPolicies: accessPolicies,
      cognitoDashboardsAuth: {
        identityPoolId: props.cognitoStack.identityPool.ref,
        role: osrole,
        userPoolId: props.cognitoStack.userPool.userPoolId,
      },
      logging: {
        appLogEnabled: true,
      }
    })

    // setup snapshot bucket (recovery bucket is separately managed)
    const snapshotBucket = new s3.Bucket(this, 'snapshotbucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })
    new cdk.CfnOutput(this, 'snapshotBucketName', {value: snapshotBucket.bucketName})
    new cdk.CfnOutput(this, 'snapshotRoleArn', {value: snapshotRole.roleArn})
    snapshotBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ["s3:ListBucket"],
      effect: iam.Effect.ALLOW,
      principals: [new iam.ArnPrincipal(snapshotRole.roleArn)],
      resources: [snapshotBucket.bucketArn],
    }))
    snapshotBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
      effect: iam.Effect.ALLOW,
      principals: [new iam.ArnPrincipal(snapshotRole.roleArn)],
      resources: [snapshotBucket.arnForObjects('*')],
    }))
    snapshotRole.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('es.amazonaws.com')]
      })
    )
  }
}
