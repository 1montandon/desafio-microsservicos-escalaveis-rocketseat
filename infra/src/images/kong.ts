import * as awsx from '@pulumi/awsx'
import * as aws from '@pulumi/aws'
import * as docker from '@pulumi/docker-build'
import * as pulumi from '@pulumi/pulumi'

// ECR - Elastic Container Register

const kongECRRepository = new awsx.ecr.Repository('kong-ecr', {
    forceDelete: true,
})

export const kongECRToken = aws.ecr.getAuthorizationTokenOutput({
    registryId: kongECRRepository.repository.registryId
})

export const kongDockerImage = new docker.Image('kong-image', {
    tags: [
        pulumi.interpolate`${kongECRRepository.repository.repositoryUrl}:latest`
    ],
    context:{
        location: '../docker/kong',
    },
    push: true,
    platforms:[
        "linux/amd64"
    ],
    registries: [
        {
            address: kongECRRepository.repository.repositoryUrl,
            username: kongECRToken.userName,
            password: kongECRToken.password
        }
    ]
})