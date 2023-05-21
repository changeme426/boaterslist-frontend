# check default AWS credentials/region (~/.aws/config, ~/aws/credentials)
.PHONY: aws-whoami
aws-whoami:
	aws sts get-caller-identity
	aws configure get region

.PHONY: deploy
deploy:
	cdk deploy

.PHONY: diff
diff:
	cdk diff

.PHONY: synth
synth:
	cdk synth
