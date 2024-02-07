import { aws_ssm as ssm } from "aws-cdk-lib";
import { SsmStack } from "../ssmStack";
import { ParameterDataType } from "aws-cdk-lib/aws-ssm";

export function createDatabaseParameters(stack: SsmStack, databaseParameters: { [key: string]: string }): void {
  const dbName = databaseParameters["DBName"] ?? "defaultTable";
  for (const parameterName in databaseParameters) {
    new ssm.StringParameter(stack, parameterName, {
      parameterName: `rds-${dbName}-${parameterName}`,
      stringValue: databaseParameters[parameterName] ?? "default",
      simpleName: true,
      dataType: ParameterDataType.TEXT,
    });
  }
}
