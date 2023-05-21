import * as cdk from 'aws-cdk-lib'
import * as construct from 'constructs'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as iam from 'aws-cdk-lib/aws-iam'

export interface CognitoStackProps extends cdk.StackProps {
  domain: string
  identityProviderDomain: string
  identityProviderClientId: string
  identityProviderClientSecret: string
}

export class CognitoStack extends cdk.Stack {
  public readonly authRole: iam.Role
  public readonly domainName: string
  public readonly identityPool: cognito.CfnIdentityPool
  public readonly userPool: cognito.UserPool
  public readonly unauthRole: iam.Role
  public readonly userPoolDomain: cognito.UserPoolDomain

  constructor(scope: construct.Construct, id: string, props: CognitoStackProps) {
    super(scope, id, props);

    this.userPool = new cognito.UserPool(this, 'userpool', {
      userPoolName: props.domain,
    })
    let userPoolClientName = props.identityProviderDomain
    if (userPoolClientName.length > 32) {
      userPoolClientName = userPoolClientName.substring(0, 32)
    }
    const idp = new cognito.CfnUserPoolIdentityProvider(this, 'identityprovider', {
      providerName: userPoolClientName,
      providerDetails: {
        client_id: props.identityProviderClientId,
        client_secret: props.identityProviderClientSecret,
        attributes_request_method: 'GET',
        oidc_issuer: 'https://' + props.identityProviderDomain,
        authorize_scopes: 'openid read:user user:email',
      },
      providerType: 'OIDC',
      attributeMapping: {
        username: 'sub',
        email: 'email',
        email_verified: 'email_verified',
        name: 'name',
      },
      userPoolId: this.userPool.userPoolId,
    })
    const userPoolClient = new cognito.UserPoolClient(this, 'client', {
      generateSecret: false,
      userPool: this.userPool,
      userPoolClientName: userPoolClientName,
    })
    this.userPoolDomain = new cognito.UserPoolDomain(this, 'userpooldomain', {
      cognitoDomain: {
        domainPrefix: props.domain,
      },
      userPool: this.userPool,
    })
    this.domainName = props.domain + ".auth." + this.region + '.amazoncognito.com'

    this.identityPool = new cognito.CfnIdentityPool(this, "identitypool", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        }
      ],
      identityPoolName: props.domain,
    })
    this.authRole = new iam.Role(this, "esadminuserrole", {
      assumedBy: new iam.FederatedPrincipal("cognito-identity.amazonaws.com", {
        'StringEquals': {
          'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated',
        },
      }, "sts:AssumeRoleWithWebIdentity"),
    })
    /* TODO this.authRole.addToPolicy(new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      effect: iam.Effect.ALLOW,
      resources: ['arn:aws:iam::058556054004:role/staging-opensearch-snapshotrole27FD9DD4-X4UC5NHRYLL'],
    })) */
    this.unauthRole = new iam.Role(this, "unauthrole", {
      assumedBy: new iam.FederatedPrincipal("cognito-identity.amazonaws.com", {
        'StringEquals': {
          'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'unauthenticated',
        },
      }, "sts:AssumeRoleWithWebIdentity"),
    })
    new cognito.CfnIdentityPoolRoleAttachment(this, "identitypoolroleattachment", {
      identityPoolId: this.identityPool.ref,
      roles: {
        'authenticated': this.authRole.roleArn,
        'unauthenticated': this.unauthRole.roleArn,
      }
    })
    // TODO: manual properties still need to be set:
    //     1. AWS: Cognito -> Identity Pool ->  check OIDC provider
    //     2. AWS: Cognito -> User Pool -> App integration -> App client -> Hosted UIs: Select OIDC identity provider
    //     3. Auth0: Applications -> [Stage] Opensearch Dashboard -> Allowed callback URL:
    //          https://[domain].auth.us-west-1.amazoncognito.com/oauth2/idpresponse
  }
}
