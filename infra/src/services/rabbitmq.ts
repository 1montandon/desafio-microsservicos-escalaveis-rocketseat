import * as awsx from "@pulumi/awsx";
import { cluster } from "../cluster";
import { appLoadBalancer, networkLoadBalancer } from "../load_balancer";

// Define o Target Group para as instâncias que receberão requisições do Load Balancer
const rabbitMQAdminTargetGroup = appLoadBalancer.createTargetGroup('rabbitmq-admin-tagert', {
    port: 15672,
    protocol: "HTTP",
    healthCheck:{
        path: '/',
        protocol: 'HTTP'
    }
})

// Cria o listener HTTP para o painel de administração do RabbitMQ
const rabbitMQAdminHttpListener = appLoadBalancer.createListener('rabbitmq-admin-listener', {
    port: 15672,
    protocol: 'HTTP',
    targetGroup: rabbitMQAdminTargetGroup
})

const amqpTargetGroup = networkLoadBalancer.createTargetGroup('amqp-targer', {
    protocol: 'TCP',
    port: 5672,
    targetType: 'ip',
    healthCheck:{
        protocol: 'TCP',
        port: '5672'
    }
})

export const amqpListener = networkLoadBalancer.createListener('amqp-listener', {
    port: 5672,
    protocol: 'TCP',
    targetGroup: amqpTargetGroup,
})

export const rabbitMQService = new awsx.classic.ecs.FargateService('farget-rabbitmq', {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
        container:{
            image: 'rabbitmq:3-management',
            cpu: 256,
            memory: 512,
            portMappings: [
                rabbitMQAdminHttpListener,
                amqpListener
            ],
            environment: [
                {name: 'RABBITMQ_DEFAULT_USER', value: 'admin'},
                {name: 'RABBITMQ_DEFAULT_PASS', value: 'admin'},
            ]
        }
    }
})