const logger = require("../helper/logger");
const logget = require ("../helper/logger")

const deploy = {
    "createDeploy": function (k8s, req, res) {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
        const methodResponse = res;
        
        const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
        createDeployment(k8sApi, req, res);
        createService(k8sApi, req, res);

    }
}

module.exports = deploy;

async function createDeployment (k8sApi, req, res) {
    const data = req.body;
    const namespaceName = req.params.namespace;
    const replica = data.replica || 1;

    var deploy = {
        kind: "Deployment",
        apiVersion: "apps/v1",
        metadata: {
            name: data.name
        },
        spec: {
            replicas: replica,
            selector: {
                matchLabels: { app: data.name }
            },
            template: {
                metadata: {
                    labels: { app: data.name }
                },
                spec: {
                    containers:[
                        {
                            name: data.name,
                            image: data.image,
                            ports: []
                        }
                    ]
                }
            }
        }
    };
    for(var i=0; i<data.ports.length; i++) {
        var portObject = {
            containerPort: data.ports[i]
        }
        deploy.spec.template.spec.containers[0].ports.push(portObject);
    }
    
    try {
        const response = await k8sApi.createNamespacedDeployment(namespaceName, deploy)
        console.log('Created deployment');
        console.log(JSON.stringify(response.body));
        res.send(response.body);
    } catch(err) {
        logger.err(err);
        if(err.response.body.reason == "AlreadyExists"){
            logger.log("Updating deployment");
            try{
                var resp = await k8sApi.replaceNamespacedDeployment(data.name, namespaceName, deploy);
                res.send(resp);
            } catch (err2) {
                logger.err(err2);
                res.send(err2);
            }
        } else{
            res.send(err);
        }
    }
}

function createService(k8sApi, req, res) {
}