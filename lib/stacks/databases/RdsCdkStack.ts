import * as cdk from "@aws-cdk/core";
import * as rds from "@aws-cdk/aws-rds";
import * as ec2 from "@aws-cdk/aws-ec2";

export class RdsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define a VPC
    const vpc = new ec2.Vpc(this, "RdsVpc", {
      maxAzs: 2,
    });

    // Define an RDS instance
    new rds.DatabaseInstance(this, "RdsInstance", {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      vpc,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
