# K8s API
This is an API to manage kubernetes resources

## Version: 1.0.0

**Contact information:**  
a.argeu@gmail.com  

**License:** [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)

### /namespace

#### GET
##### Summary

List namespaces

##### Description

List namespaces from the running cluster

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

#### POST
##### Summary

Create namespace

##### Description

Create namespace in the cluster

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body | Status values that need to be considered for filter | Yes | [Namespace](#namespace-1) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | successful operation |
| 400 | Invalid status value |

### /namespace/{namespaceName}/deploy

#### POST
##### Summary

Deploy application to namespace

##### Description

Deploys application to the specified namespace in path

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| namespaceName | path | Name of an existing namespace | Yes | string |
| body | body | Deploy app parameters | Yes | [DeployApp](#deployapp) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | successful operation |
| 400 | Invalid value |

### /namespace/{namespaceName}/pods

#### GET
##### Summary

List pods

##### Description

List pods from the speficied namespace

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| namespaceName | path | Name of an existing namespace | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | successful operation |
| 400 | Invalid value |

### Models

#### DeployApp

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | No |
| image | string |  | No |
| port | long |  | No |
| appPath | string |  | No |

#### Namespace

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | No |
