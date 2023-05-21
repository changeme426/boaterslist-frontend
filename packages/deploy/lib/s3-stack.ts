import * as cdk from 'aws-cdk-lib'
import * as construct from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'

export class S3Stack extends cdk.Stack {
  constructor(scope: construct.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const s3Bucket = new s3.Bucket(this, 'bluserimgs', {
      accessControl: s3.BucketAccessControl.PRIVATE,
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [s3.HttpMethods.POST],
          allowedOrigins: ['*'],
        },
      ],
      encryption: s3.BucketEncryption.S3_MANAGED,
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      versioned: true,
    })
    new cdk.CfnOutput(this, 'imageBucketName', {
      value: s3Bucket.bucketName,
      description: 'The name of the s3 bucket',
      exportName: 'imageBucketName',
    })
  }
}
