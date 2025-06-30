import * as awsx from "@pulumi/awsx";
import * as pulumi from '@pulumi/pulumi'
import { cluster } from "../cluster";
import { ordersDockerImage } from '../images/orders'
import { amqpListener } from "./rabbitmq";
import { appLoadBalancer } from "../load_balancer";

// Define o Target Group para as instâncias que receberão requisições do Load Balancer
const ordersTargetGroup = appLoadBalancer.createTargetGroup('orders-tagert', {
    port: 3333,
    protocol: "HTTP",
    healthCheck:{
        path: '/health',
        protocol: 'HTTP'
    }
})

// Cria o listener HTTP para o painel de administração do RabbitMQ
export const ordersHttpListener = appLoadBalancer.createListener('orders-listener', {
    port: 3333,
    protocol: 'HTTP',
    targetGroup: ordersTargetGroup
})

export const ordersService = new awsx.classic.ecs.FargateService('farget-orders', {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
        container: {
            image: ordersDockerImage.ref,
            cpu: 256,
            memory: 512,
            portMappings: [
                ordersHttpListener,
            ],
            environment: [
                {
                    name: 'BROKER_URL',
                    value: pulumi.interpolate`amqp://admin:admin@${amqpListener.endpoint.hostname}:${amqpListener.endpoint.port}`
                },
                {
                    name: 'DATABASE_URL',
                    value: 'postgresql://orders_owner:npg_0NSzWKI6iocX@ep-late-surf-a4p7uxpn.us-east-1.aws.neon.tech/orders?sslmode=require&channel_binding=require'
                },
                {
                    name: 'OTEL_TRACES_EXPORTER',
                    value: 'otlp'
                },
                {
                    name: 'OTEL_EXPORTER_OTLP_ENDPOINT',
                    value: 'https://otlp-gateway-prod-sa-east-1.grafana.net/otlp'
                },
                {
                    name: 'OTEL_SERVICE_NAME',
                    value: 'orders'
                },
                {
                    name: 'OTEL_EXPORTER_OTLP_HEADERS',
                    value: 'Authorization=Basic MTMwMjM3NTpnbGNfZXlKdklqb2lNVFEzTURJM01pSXNJbTRpT2lKbGRtVnVkRzh0Ym05a1pXcHpJaXdpYXlJNklqUnZUSGhuTVRVNWNqaENhMHM0TlRWdVQxTTVlREJaVGlJc0ltMGlPbnNpY2lJNkluQnliMlF0YzJFdFpXRnpkQzB4SW4xOQ=='
                },
                {
                    name: 'OTEL_RESOURCE_ATTRIBUTES',
                    value: 'service.name=my-app,service.namespace=my-application-group,deployment.environment=production'
                },
                {
                    name: 'OTEL_NODE_RESOURCE_DETECTORS',
                    value: 'env,host,os'
                },
                {
                    name: 'OTEL_NODE_ENABLED_INSTRUMENTATIONS',
                    value: 'http,express,pg,amqplib'
                }
            ]
        }
    }
})