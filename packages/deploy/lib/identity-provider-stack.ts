import * as cdk from 'aws-cdk-lib'
import * as construct from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'

export interface IdentityProviderStackProps extends cdk.StackProps {
  audience: string
  domain: string
}

export class IdentityProviderStack extends cdk.Stack {
  public readonly name: string
  public readonly provider: iam.OpenIdConnectProvider

  constructor(scope: construct.Construct, id: string, props: IdentityProviderStackProps) {
    super(scope, id, props);

    this.provider = new iam.OpenIdConnectProvider(this, "identityprovider", {
      url: 'https://' + props.domain,
      clientIds: [props.audience],
    })
  }
}
