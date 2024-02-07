import * as path from "path";
import { Construct } from "constructs";
import { aws_ec2 as ec2 } from "aws-cdk-lib";
import { aws_lambda as lambda } from "aws-cdk-lib";

export function lambdaCreateTables(scope: Construct, vpc: ec2.Vpc, securityGroup: ec2.SecurityGroup): lambda.Function {
  const lambdaFunctionCreateTables = new lambda.Function(scope, "CreateTables", {
    functionName: "CreateTables",
    runtime: lambda.Runtime.PYTHON_3_9,
    code: lambda.Code.fromAsset(path.join(__dirname, "./lambdas/assets/user_table.zip")),
    handler: "user_table.handler",
    vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    securityGroups: [securityGroup],
  });

  return lambdaFunctionCreateTables;
}
