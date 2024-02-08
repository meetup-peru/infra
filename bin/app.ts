#!/usr/bin/env node
import "source-map-support/register";
import { RdsCdkStack } from "../lib/stacks/databases";
import * as cdk from "aws-cdk-lib";
import { SsmStack } from "../lib/stacks/ssm/ssmStack";

const app = new cdk.App();

const rdsStack = new RdsCdkStack(app, "RdsStack");
const ssmStack = new SsmStack(app, "SsmStack");

ssmStack.node.addDependency(rdsStack);

app.synth();
