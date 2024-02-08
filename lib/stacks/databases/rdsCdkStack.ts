import { lambdaCreateTables } from "./lambdaCreateTables";
import * as cdk from "aws-cdk-lib";
import { aws_ec2 as ec2 } from "aws-cdk-lib";
import { aws_rds as rds } from "aws-cdk-lib";
import { Construct } from "constructs";

export class RdsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "RdsVpc", {
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 26,
          name: "isolatedSubnet",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
    const port = 5432;

    // Create a Security Group
    const dbSecurityGroup = new ec2.SecurityGroup(this, "databaseSG", {
      securityGroupName: "databaseSG",
      vpc,
    });

    dbSecurityGroup.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(port));

    // Read user and password from environment variables
    const dbUsername = process.env.DB_USERNAME ?? "defaultUsername";
    const dbPassword = process.env.DB_PASSWORD ?? "defaultPassword";

    const engine = rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_14_10 });

    // Define an RDS instance
    const rdsInstance = new rds.DatabaseInstance(this, "RdsInstance", {
      engine,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      port,
      securityGroups: [dbSecurityGroup],
      databaseName: "postgredatabase",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      credentials: rds.Credentials.fromUsername(dbUsername, { password: cdk.SecretValue.unsafePlainText(dbPassword) }),
    });

    new cdk.CfnOutput(this, "DBHost", {
      value: rdsInstance.dbInstanceEndpointAddress,
      exportName: "DBHost",
    });
    new cdk.CfnOutput(this, "DBPort", {
      value: rdsInstance.dbInstanceEndpointPort,
      exportName: "DBPort",
    });
    new cdk.CfnOutput(this, "DBName", {
      value: rdsInstance.instanceIdentifier,
      exportName: "DBName",
    });
    new cdk.CfnOutput(this, "DBUser", {
      value: dbUsername,
      exportName: "DBUser",
    });
    new cdk.CfnOutput(this, "DBPassword", {
      value: dbPassword,
      exportName: "DBPassword",
    });

    const lambdaFunctionCreateTable = lambdaCreateTables(this, vpc, dbSecurityGroup);
    rdsInstance.connections.allowDefaultPortFrom(lambdaFunctionCreateTable);
  }
}
