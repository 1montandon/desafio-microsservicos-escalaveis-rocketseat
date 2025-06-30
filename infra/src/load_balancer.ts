import * as awsx from '@pulumi/awsx'
import { cluster } from "./cluster";

export const appLoadBalancer = new awsx.classic.lb.ApplicationLoadBalancer('app-lb', {
    securityGroups: cluster.securityGroups,
})

// app Load Balancer - HTTP/HTTPs

export const networkLoadBalancer = new awsx.classic.lb.NetworkLoadBalancer('net-lb', {
    subnets: cluster.vpc.publicSubnetIds,
})