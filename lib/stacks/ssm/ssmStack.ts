import { RdsCdkStack } from "../databases";
import { createDatabaseParameters } from "./databases/createParameters";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export class SsmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps & { rdsStack: RdsCdkStack }) {
    super(scope, id, props);

    const databaseParameterNames = ["DBHost", "DBPort", "DBName", "DBUser", "DBPassword"];

    const databaseParameters: { [key: string]: string } = {};
    for (const parameterName of databaseParameterNames) {
      databaseParameters[parameterName] = cdk.Fn.importValue(parameterName);
    }
    createDatabaseParameters(this, databaseParameters);
  }
}
