# Kubernetes API Service

Simple API service to manipulate k8s resources through an API

## Idea

The main Idea is to create an example of a simple Kubernetes Controller that runs in the cluster to observe and manipulate resources

### Deploying a service

POST `/namespace/<namespace-name>/deploy`

Body:
```json
{
    "name": "<deployment-name>", 
    "image": "argeualcantara/k8s-api-service:latest",
    "ports": [3000]
}
```