import * as awsx from '@pulumi/awsx'
import * as aws from '@pulumi/aws'
import * as docker from '@pulumi/docker-build'
import * as pulumi from '@pulumi/pulumi'

// ECR - Elastic Container Register

const ordersECRRepository = new awsx.ecr.Repository('orders-ecr', {
    forceDelete: true,
})

export const ordersECRToken = aws.ecr.getAuthorizationTokenOutput({
    registryId: ordersECRRepository.repository.registryId
})

export const ordersDockerImage = new docker.Image('orders-image', {
    tags: [
        pulumi.interpolate`${ordersECRRepository.repository.repositoryUrl}:latest`
    ],
    context:{
        location: '../app-orders',
    },
    push: true,
    platforms:[
        "linux/amd64"
    ],
    registries: [
        {
            address: ordersECRRepository.repository.repositoryUrl,
            username: ordersECRToken.userName,
            password: ordersECRToken.password
        }
    ]
})